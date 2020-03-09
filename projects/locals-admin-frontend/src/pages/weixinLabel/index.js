import React, { Component } from 'react'
import { Table,Button, message } from 'antd'
import {weixinLabelService} from '../../services'
import {pageOption, checkKey} from '../../utils/utils'
import {connect} from "react-redux"
import EditLabelModalForm from './editModal'
import DetailListTable from './detailList'
import ActionListTable from './actionList'

const mapStateToProps = (state, action) => {
    return {
        weixinLabelM: state.weixinLabelM,
        weixinLabelDetailM: state.weixinLabelDetailM,
        areaM:state.areaM
    }
}

class WeixinLabel extends Component {
    constructor () {
        super()
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            visible:false,
            id:'',
            dataType:true,
            data:'',
            areaList:null,
            loading:true,
            editModalVisible:false,
            detailVisible:false,
            actionVisible:false
        }
        this.onAdd = this.onAdd.bind(this)
    }
    componentDidMount () {
        this.getLabelManage()
    }

    // 获取table数据
    getLabelManage () {
        let params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        this.setState({loading:true})
        weixinLabelService.getTable(params).then((data) => {
            this.props.dispatch({
                type: 'GET_LABEL_LIST_SUCCESS',
                payload:data
            })
            this.setState({loading:false})
        }).catch( e =>{
            this.setState({loading:false})
        })
    }

    // 详情
    onDetail = (record) => () => {
        this.setState({
            detailVisible:true,
            data:{
                id:record.id,
                tagId:record.tagId
            }
        })
    }
    onDelete = (record) => () => {
        weixinLabelService.deleteUserTag(record.id).then(res => {
            message.success('删除成功')
            this.getLabelManage()
        }).catch(e => {
            message.success('请求失败')
        })
    }
    // 编辑
    onEdit = (record) => () => {
        this.setState({
            visible:true,
            dataType:true,
            data:{
                id:record.id,
                name:record.name,
                tagId:record.tagId
            }
        })
    }

    //标注用户
    onTag = (record) => () => {
        this.setState({
            actionVisible:true,
            tagId:record.id
        })
    }

    //新增
    onAdd = () =>{
        this.setState({
            visible:true,
            dataType:false
        })
    }

    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false,
            actionVisible: false,
            detailVisible:false
        })
        this.getLabelManage()
    }

    // 主体
    render () {
        let self = this
        const scroll = {
            x:true,
            y:false
        }
        const columns = [{
            title: '标签名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '标签下的用户数量',
            dataIndex: 'count',
            key: 'count',
            align:'center'
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:'350px',
            render: function (text, record, index) {
                let disabled = false
                if (record && (record.name === '星标组')) {
                    disabled = true
                }
                return (
                    <div>
                        <Button
                            className="mr-sm"
                            type="primary"
                            size="small"
                            name="stop"
                            onClick={self.onTag(record)}
                        >
                            批量操作用户标签
                        </Button>
                        <Button
                            className="mr-sm"
                            type="primary"
                            size="small"
                            name="stop"
                            onClick={self.onEdit(record)}
                            disabled={disabled}
                        >
                            编辑
                        </Button>
                        <Button
                            className="mr-sm"
                            type="primary"
                            size="small"
                            name="lookDetail"
                            onClick={self.onDetail(record)}
                        >详情</Button>
                        <Button
                            className="mr-sm"
                            type="danger"
                            size="small"
                            name="lookDetail"
                            disabled={disabled}
                            onClick={self.onDelete(record)}
                        >删除</Button>
                    </div>
                )
            }
        }]
        const pageObj = {
            total: Number(this.props.weixinLabelM.total || 0 ),
            pageSize: this.props.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize }, this.getLabelManage)
            },
            onChange: (value,pageSize) => {
                this.setState({ 'pageNum': value, pageSize }, this.getLabelManage)
            }
        }
        return (
            <div>
                <div className="text-right padder-v-sm">
                    <Button
                        type="primary"
                        onClick={self.onAdd}
                    >
                        新增
                    </Button>
                </div>
                <Table
                    bordered
                    scroll={scroll}
                    columns={columns}
                    dataSource={checkKey(this.props.weixinLabelM.list)}
                    rowKey="id"
                    pagination={pageObj}
                    loading={this.state.loading}
                />
                {
                    this.state.visible ?
                        <EditLabelModalForm
                            visible={this.state.visible}
                            dataType={this.state.dataType}
                            data={this.state.data}
                            onCancel={this.handleCancel}
                        /> : null
                }
                {
                    this.state.detailVisible ?
                        <DetailListTable
                            visible={this.state.detailVisible}
                            data={this.state.data}
                            onCancel={this.handleCancel}
                        /> : null
                }
                {
                    this.state.actionVisible ?
                        <ActionListTable
                            visible={this.state.actionVisible}
                            tagId={this.state.tagId}
                            id={this.state.id}
                            onCancel={this.handleCancel}
                        /> : null
                }
            </div>
        )
    }
}
export default connect(mapStateToProps)(WeixinLabel)

