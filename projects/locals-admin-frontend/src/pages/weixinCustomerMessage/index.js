import React, { Component } from 'react'
import { weixinCustomerMessageService } from '../../services'
import { Button, message, Tooltip } from 'antd'
import { pageOption, checkKey, getNewImagePrefix } from '../../utils/utils'
import Search from '../../components/search'
import AddModal from './addModal'
import SendModal from './sendModal'
import { SubTable } from '../../components/index'

const searchConfig = {
    items: [{
        type: 'text',
        name: '名称',
        key: 'id',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入标题'
    }, {
        type: 'text',
        name: '内容',
        key: 'content',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入内容'
    }]
}

class WeixinCustomerMessage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            tableData: [],
            searchFields: {},
            sorterA: 'asc',
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            totalCount: 0,
            addModalVisible: false,
            isLoading: true,
            sendMessageModalVisible: false,
            replyId: null
        }
    }
    closeModal = () => {
        this.setState({
            addModalVisible: false,
            sendMessageModalVisible: false
        })
    }
    showSendMessageModal = (id) => {
        this.setState({
            sendMessageModalVisible: true,
            replyId: id
        })
    }
    showAddModal = () => {
        this.setState({
            addModalVisible: true
        })
    }
    addReplys = (data) => {
        weixinCustomerMessageService.addReplys(data).then((e)=>{
            message.success('添加成功！')
            this.setState({
                addModalVisible: false
            }, () => {
                this.tableThis.renderTable()
            })
        })
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                id: searchFields.id.value,
                content: searchFields.content.value
            }
        })
    }
    fixTableFixedCol = () => {
        // 当图片加载完成后撑开列表，触发resize让Table的固定元素重新对齐
        setTimeout( function () {
            window.dispatchEvent(new Event('resize'))
        }, 500)
    }
    renderContent = (content) => {
        if (!content) return null
        const output = <div className="w200">{content}</div>
        return (
            <Tooltip title={output}>
                <div className="ellipsis w100">{content}</div>
            </Tooltip>
        )
    }
    render () {
        const self = this
        const _state = this.state
        // const scroll = {
        //     x: 1200,
        //     y: false
        // }
        const columns = [{
            title: '客服ID',
            dataIndex: 'id',
            key: 'id',
            width: 150
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 150,
            sortOrder: 'descend',
            sorter: true,
            render: function (type) {
                var result = '';
                switch(type.toLowerCase()) {
                case 'text':
                    result = '文本'
                    break;
                case 'article':
                    result = '图文'
                    break;
                default:
                    break;
                }
                return result
            }
        }, {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
            width: 150,
            render: this.renderContent
        }, {
            title: '图片地址（图文）',
            dataIndex: 'picUrl',
            key: 'picUrl',
            width: 250,
            render: (url) => {
                if (url) {
                    const output = <div className="w200">{url}</div>
                    return (
                        <Tooltip title={output}>
                            <img
                                className="adsImg"
                                src={getNewImagePrefix(url)}
                                alt="加载失败..."
                                onLoad={this.fixTableFixedCol}
                            />
                        </Tooltip>
                    )
                }
            }
        }, {
            title: '标题（图文）',
            dataIndex: 'title',
            key: 'title',
            width: 150,
            render: this.renderContent
        }, {
            title: '描述（图文）',
            dataIndex: 'description',
            key: 'description',
            width: 200,
            render: this.renderContent
        }, {
            title: '链接地址（图文）',
            dataIndex: 'linkUrl',
            key: 'linkUrl',
            width: 350,
            render: this.renderContent
        }, {
            title: '创建时间',
            dataType: 'time',
            dataIndex: 'createTime',
            key: 'createTime',
            sorter: true,
            width: 300
        }, {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
            width: 200
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'action',
            render: (val) => (
                <Button
                    type="primary"
                    name="lookPick"
                    size="small"
                    onClick={function () {self.showSendMessageModal(val)}}
                >发送信息</Button>
            ),
            width: 150
        }]
        const subTableItem = {
            getTableService: weixinCustomerMessageService.getReplys,
            columns: columns,
            rowKey: "id",
            searchFields: _state.searchFields,
            sorterKeys: [{
                key: 'type',
                str: 'type'
            }],
            antdTableProps: {
                bordered: true
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
                    <div className="mb10 text-right">
                        <Button
                            type="primary"
                            onClick={this.showAddModal}
                        >新增</Button>
                    </div>
                    <SubTable {...subTableItem} />
                    <AddModal
                        title="新增消息"
                        visible={_state.addModalVisible}
                        closeModal={this.closeModal}
                        addReplys={this.addReplys}
                    />
                    {
                        this.state.sendMessageModalVisible ?
                            <SendModal
                                title="发送信息"
                                visible={_state.sendMessageModalVisible}
                                closeModal={this.closeModal}
                                sendType="replyId"
                                id={this.state.replyId}
                            /> : null
                    }

                </div>
            </div>
        )
    }
}

export default WeixinCustomerMessage