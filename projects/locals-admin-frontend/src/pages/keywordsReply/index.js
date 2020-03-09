import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Form, Button, Modal, Input, Select,notification } from 'antd'
import {serachingkeywordsReplylist,serachkeywordsReplylistSuccess} from '../../actions/keywordsReplylist'
import { keywordsReplyService } from '../../services'
import {pageOption, dataFormat, checkKey} from '../../utils/utils'
const FormItem = Form.Item
const Option = Select.Option

const mapStateToProps = (state, action) => {
    return {
        keywordsReplylist: state.keywordsReplylist
    }
}

class KeywordsReplyForm extends Component {
    constructor (props) {
        super (props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions:pageOption.pageSizeOpts,
            addDiaVisible: false,
            searchFields:{},
            columns:[],
            replysList: []
        }
        this.renderTable = this.renderTable.bind(this)
    }
    componentDidMount (){
        this.renderTable()
        this.getReplys()
    }
    renderTable () { // 获取table数据
        const params = {
            pageNum:  this.state.pageNum,
            pageSize: this.state.pageSize
        }
        this.props.dispatch(serachingkeywordsReplylist(this.props.keywordsReplylist))
        keywordsReplyService.getTable(params).then((data) => {
            this.props.dispatch(serachkeywordsReplylistSuccess(data))
        }).catch((e) => {
            this.props.dispatch(serachingkeywordsReplylist(this.props.keywordsReplylist))
        })
    }
    getReplys = () => {
        const params = {
            pageNum:  this.state.pageNum,
            pageSize: 9999
        }
        keywordsReplyService.getReplys(params).then(data => {
            if(data){
                this.setState({
                    replysList: data.list || []
                })
            }
        })
    }
    addKeyWordReply = (name,replyId) => {
        keywordsReplyService.addKeyword({name,replyId}).then(data=>{
            notification.success({
                message: '新增成功'
            })
            this.setState({
                addDiaVisible: false
            },this.renderTable)
        })
    }
    addDiaVisibleFn = () =>{
        this.setState({
            addDiaVisible: true
        })
    }
    addKeyWord = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.addKeyWordReply(values.name,values.replyId)
            }
        })
    }
    handleCancel = () => {
        this.setState({
            addDiaVisible:false
        })
    }
    render () {
        const _state = this.state
        const columns = [{
            title: '关键词',
            dataIndex: 'name',
            key: 'name',
            exportType: 'text'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            exportType: 'text',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '操作人',
            dataIndex: 'updator',
            key: 'updator'
        }]
        const pageObj = {
            total: this.props.keywordsReplylist.total || 0,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize: pageSize }, this.renderTable)
            },
            onChange: (value,pageSize) => {
                this.setState({ pageNum: value, pageSize: pageSize }, this.renderTable)
            }
        }
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        }
        const replyOption = _state.replysList.map(item => <Option key={item.id}>{item.content}</Option>)
        return (
            <div>
                <div className="pt10 mb10 text-right">
                    <Button type="primary" onClick={this.addDiaVisibleFn}>新增</Button>
                </div>
                <Table columns={columns} dataSource={checkKey(this.props.keywordsReplylist.list)} pagination={pageObj} loading={this.props.keywordsReplylist.loading} />
                <Modal
                    title="新增"
                    visible={_state.addDiaVisible}
                    onOk={this.addKeyWord}
                    onCancel={this.handleCancel}
                    okText="提交"
                    cancelText="关闭"
                >
                    <Form>
                        <FormItem label="关键词" {...formItemLayout}>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入关键词!' }]
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                        <FormItem label="回复内容" {...formItemLayout}>
                            {getFieldDecorator('replyId', {
                                rules: [{ required: true, message: '请选择回复内容!' }]
                            })(
                                <Select>
                                    {replyOption}
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

let KeywordsReply = Form.create()(KeywordsReplyForm)
export default connect(mapStateToProps)(KeywordsReply)
