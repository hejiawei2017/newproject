import React, { Component } from 'react'
import { weixinTemplateMessageService } from '../../services'
import { Table, Button, message } from 'antd'
import { pageOption, dataFormat, checkKey } from '../../utils/utils'
import AddModal from './addModal'
import Search from '../../components/search'
import SendModal from '../weixinCustomerMessage/sendModal'

const searchConfig = {
    items: [{
        type: 'text',
        name: '模板标题',
        key: 'title',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入模板标题'
    }]
}

class WeixinTemplateMessage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            totalCount: 0,
            addModalVisible: false,
            isLoading: true,
            sendMessageModalVisible: false,
            sorterA: '',
            templateId: null
        }
    }
    componentDidMount () {
        this.renderTable()
    }
    closeModal = () => {
        this.setState({
            addModalVisible: false,
            sendMessageModalVisible: false
        })
    }
    showAddModal = () => {
        this.setState({
            addModalVisible: true
        })
    }
    showSendMessageModal = (id) => {
        this.setState({
            sendMessageModalVisible: true,
            templateId: id
        })
    }
    addTemplateMessage = (data) =>{
        weixinTemplateMessageService.postTemplate(data).then((e)=>{
            message.success('添加成功！')
            this.setState({
                addModalVisible: false
            }, () => {
                this.renderTable()
            })
        })
    }
    handleSortChange = (pagination, filters, sorter) => {
        if(sorter.order){
            if(sorter.order === 'descend'){
                this.setState({
                    sorterA : 'desc'
                })
            }else if(sorter.order === 'ascend'){
                this.setState({
                    sorterA : 'asc'
                })
            }
            this.renderTable({orderBy:(sorter.field + ' ' + this.state.sorterA)})
        }
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                title: searchFields.title.value
            }
        }, this.renderTable)
    }
    renderTable = () => {
        this.setState({
            isLoading: true
        })
        weixinTemplateMessageService.getTemplates().then((data)=>{
            this.setState({
                tableData: data.list,
                totalCount: data.total,
                isLoading: false
            })
        }).catch( e =>{
            this.setState({isLoading:false})
        })
    }
    render () {
        const self = this
        const _state = this.state
        const scroll = {
            x: true,
            y: false
        }
        const columns = [{
            title: '模板标题',
            dataIndex: 'template.title',
            key: 'title'
        }, {
            title: '创建时间',
            dataIndex: 'template.createTime',
            key: 'createTime',
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '操作人',
            dataIndex: 'template.creator',
            key: 'creator'
        }, {
            title: '操作',
            dataIndex: 'template.id',
            key: 'action',
            render: (val) => (
                <Button
                    type="primary"
                    name="lookPick"
                    className="mr-sm"
                    size="small"
                    onClick={function () {self.showSendMessageModal(val)}}
                >发送信息</Button>
            )
        }]
        const pageObj = {
            total: Number(_state.totalCount || 0 ),
            pageSize: _state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: _state.pageSizeOptions,
            current: _state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize }, this.renderTable)
            },
            onChange: (value, pageSize) => {
                this.setState({ 'pageNum': value, pageSize }, this.renderTable)
            }
        }
        return (
            <div>
                <Search
                    onSubmit={this.onSearch}
                    config={searchConfig}
                    dataSource={checkKey(_state.tableData)}
                />
                <div className="banner-list">
                    <div className="pt10 mb10 text-right">
                        <Button
                            type="primary"
                            onClick={this.showAddModal}
                        >新增</Button>
                    </div>
                    <Table
                        bordered
                        scroll={scroll}
                        columns={columns}
                        dataSource={checkKey(_state.tableData)}
                        rowKey="key"
                        pagination={pageObj}
                        onChange={this.handleSortChange}
                        loading={_state.isLoading}
                    />
                    {
                        this.state.addModalVisible ?
                            <AddModal
                                title="新增消息"
                                visible={_state.addModalVisible}
                                toggleModal={this.closeModal}
                                addTemplateMessage={this.addTemplateMessage}
                            /> : null
                    }
                    {
                        this.state.sendMessageModalVisible ?
                            <SendModal
                                title="发送信息"
                                visible={_state.sendMessageModalVisible}
                                closeModal={this.closeModal}
                                sendType="templateId"
                                id={this.state.templateId}
                            /> : null
                    }

                </div>
            </div>
        )
    }
}

export default WeixinTemplateMessage