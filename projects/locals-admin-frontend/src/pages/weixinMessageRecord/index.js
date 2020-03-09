import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Table, Button, Modal, message } from 'antd'
import { pageOption, dataFormat, checkKey,getNewImagePrefix } from '../../utils/utils'
import { dicModel, sexList, wechatSubscribeSceneObj } from '../../utils/dictionary'
import { weixinCustomerMessageService , weixinUserlistService, weixinTemplateMessageService } from '../../services'

const FormItem = Form.Item

const mapStateToProps = (state, action) => {
    return {
        weixinUserlist: state.weixinUserlist
    }
}

class WeixinMessageRecord extends Component {
    constructor (props) {
        super(props)
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            isLoading: false,
            showCustomerModal: false,
            showTemplateModal: false,
            showUesrModal: false,
            showDetail: false,
            templateMessageDetail: {},
            templateDatas: [],
            custormerMessageDetail: {},
            userModalData: {},
            messageList: null,
            loadingDetail: false,
            detailPage: {
                pageNum: pageOption.pageNum,
                pageSize: pageOption.pageSize,
                pageSizeOptions:pageOption.pageSizeOpts
            }
        }
    }
    componentDidMount () {
        this.renderTable()
    }
    showMsgIdInfomation = (record) => {
        this.setState({isLoading: true})
        let { type } = record
        switch (type) {
        case "客服":
            this.showCustomerModal(record.reply.id)
            break;
        case "模板":
            this.showTemplateModal(record.template.template.id)
            break;
        default:
            break;
        }
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
    handleSortDetailChange = (pagination, filters, sorter) => {
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
            this.renderDetailTable({orderBy:(sorter.field + ' ' + this.state.sorterA)})
        }else{
            this.renderDetailTable()
        }
    }
    showCustomerModal = (id) => {
        this.getCustomerMessage(id)
    }
    showTemplateModal = (id) => {
        this.getTemplateMessage(id)
    }
    showUserInfomation = (e) => {
        let id = e.target.id
        this.getUserInfo(id)
    }
    getTemplateMessage = (id) => {
        const hide = message.loading('获取数据中...', 0);
        weixinTemplateMessageService.getTemplate(id).then( data => {
            this.setState({
                templateMessageDetail: data.template,
                templateDatas: data.templateDatas,
                showTemplateModal: true,
                isLoading: false
            }, hide)
        }).catch(e => {
            this.setState({isLoading: false})
            message.warning('无法获取微信模板详情信息！')
        })
    }
    getCustomerMessage = (id) => {
        const hide = message.loading('获取数据中...', 0);
        weixinCustomerMessageService.getReply(id).then( data => {
            this.setState({
                custormerMessageDetail: data,
                showCustomerModal:true,
                isLoading: false
            }, hide)
        }).catch(e => {
            this.setState({isLoading: false})
            message.warning('无法获取微信客服详情信息！')
        })
    }
    getUserInfo = (id) => {
        const hide = message.loading('获取数据中...', 0);
        weixinUserlistService.getUser(id).then((data)=>{
            this.setState({
                userModalData:data,
                showUesrModal:true,
                isLoading: false
            }, hide)
        }).catch((e) => {
            this.setState({isLoading: false})
            message.warning('无法获取用户信息！')
        })
    }
    detail = (record) => () => {
        let { userId } = record
        this.setState({
            showDetail: true,
            userId: userId
        }, this.renderDetailTable)
    }
    renderDetailTable = (sortData) => {
        let params = {
            pageNum: this.state.detailPage.pageNum,
            pageSize: this.state.detailPage.pageSize,
            ...sortData
        }
        this.setState({
            loadingDetail: true
        })
        weixinCustomerMessageService.getMessagesDetail(this.state.userId, params).then(data=>{
            this.setState({
                messageList: data.list,
                loadingDetail: false
            })
        }).catch((e) => {
            this.setState({loadingDetail: false})
            message.warning('无法获取消息列表！')
        })
    }
    renderTable = (sortData) => {
        this.setState({isLoading: true})
        let params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            ...sortData
        }
        weixinCustomerMessageService.getMessages(params).then((data)=>{
            this.setState({
                tableData: checkKey(data.list),
                totalCount: data.total,
                isLoading: false
            })
        }).catch(e => {
            this.setState({isLoading: false})
            message.warning('无法获取微信客服消息！')
        })
    }
    onModalCancel = () => {
        this.setState({
            showCustomerModal: false,
            showTemplateModal: false,
            showUesrModal: false
        })
    }
    cancelDetail = () => {
        this.setState({
            showDetail: false
        })
    }
    renderTypeText = (type) => {
        var result = '';
        switch(type) {
        case 'TEXT':
            result = '文本'
            break;
        case 'ARTICLE':
            result = '图文'
            break;
        default:
            break;
        }
        return result
    }
    isShowAticle = (type) => {
        if (type === 'ARTICLE') {
            return (
                <div>
                    {this.renderUserItem('图片', <img src={this.state.custormerMessageDetail.picUrl} width="200" alt="图片" />)}
                    {this.renderUserItem('标题',this.state.custormerMessageDetail.title)}
                    {this.renderUserItem('图片描述',this.state.custormerMessageDetail.description)}
                    {this.renderUserItem('跳转链接',this.state.custormerMessageDetail.linkUrl)}
                </div>
            )
        }
    }
    renderCustomerModal = () => {
        return this.state.showCustomerModal ? (
            <Modal title="客服消息" {...dicModel} visible={this.state.showCustomerModal} footer={null} onCancel={this.onModalCancel}>
                { this.state.custormerMessageDetail ? (
                    <Form>
                        {this.renderUserItem('ID',this.state.custormerMessageDetail.id)}
                        {this.isShowAticle(this.state.custormerMessageDetail.type)}
                        {this.renderUserItem('内容',this.state.custormerMessageDetail.content)}
                        {this.renderUserItem('类型',this.renderTypeText(this.state.custormerMessageDetail.type))}
                        {this.renderUserItem('创建人',this.state.custormerMessageDetail.creator)}
                    </Form>
                ) : null }
            </Modal>
        ) : null
    }
    renderTemplateDetailList = () => {
        return this.state.templateDatas.map( v => (
            <p key={v.id}>
                {v.name ? v.name + ':' : null}
                <span style={{color: v.color}}>{v.content}</span>
            </p>
        ))
    }
    renderTemplateModal = () => {
        return this.state.showTemplateModal ? (
            <Modal title="模版消息" {...dicModel} visible={this.state.showTemplateModal} footer={null} onCancel={this.onModalCancel}>
                {this.state.templateMessageDetail ? (
                    <Form>
                        {this.renderUserItem('模板ID',this.state.templateMessageDetail.id)}
                        {this.renderUserItem('标题',this.state.templateMessageDetail.title)}
                        {this.renderUserItem('一级行业',this.state.templateMessageDetail.primaryIndustry)}
                        {this.renderUserItem('二级行业',this.state.templateMessageDetail.deputyIndustry)}
                        {this.renderUserItem('模板内容',this.state.templateMessageDetail.content)}
                        {this.renderUserItem('模板示例',this.state.templateMessageDetail.example)}
                        {this.renderUserItem('模板', <div>{this.renderTemplateDetailList()}</div>)}
                    </Form>
                ) : null}
            </Modal>
        ) : null
    }
    renderUserItem = (key,value) => {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        }
        return <FormItem {...formItemLayout} label={key}>
            <span className="ant-form-text">{value ? value : '-'}</span>
        </FormItem>
    }
    renderUesrModal = () => {
        return this.state.showUesrModal ? (
            <Modal title="用户消息" {...dicModel} visible={this.state.showUesrModal} footer={null} onCancel={this.onModalCancel}>
                <Form>
                    {this.renderUserItem('昵称', <span dangerouslySetInnerHTML={{__html: this.state.userModalData.nickname}}></span>)}
                    {this.renderUserItem('性别',sexList[this.state.userModalData.sex])}
                    {this.renderUserItem('关注方式',wechatSubscribeSceneObj[this.state.userModalData.subscribeScene])}
                    {this.renderUserItem('国家',this.state.userModalData.country)}
                    {this.renderUserItem('省市',this.state.userModalData.province)}
                    {this.renderUserItem('头像',<img className="adsImg height60" src={getNewImagePrefix(this.state.userModalData.headimgUrl)} alt="加载失败..." width = "60px" />)}
                </Form>
            </Modal>
        ) : null
    }
    renderDetailModal = () => {
        const self = this
        const _state = this.state
        const columns = [
            {
                title: '消息ID',
                dataIndex: 'id',
                key: 'id',
                width: '150px',
                render: (val, record) => (
                    <Button
                        type="primary"
                        name="lookPick"
                        className="mr-sm"
                        size="small"
                        onClick={function () {self.showMsgIdInfomation(record)}}
                    >
                        {val}
                    </Button>
                )
            },
            {
                title: '消息类型',
                dataIndex: 'type',
                key: 'type',
                width: '150px'
            },
            {
                title: '用户',
                dataIndex: 'nickName',
                key: 'nickname',
                width: '150px',
                render: (nickname, record) => (
                    <Button
                        type="primary"
                        name="lookPick"
                        className="mr-sm"
                        size="small"
                        id={record.userId}
                        onClick={this.showUserInfomation}
                    >
                        <span dangerouslySetInnerHTML={{__html: nickname}}></span>
                    </Button>
                )
            },
            {
                title: '发消息时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '300px',
                render: val => <span>{dataFormat(+val, 'YYYY-MM-DD HH:mm:ss')}</span>
            }
        ]
        const pageObj = {
            total: Number(_state.detailPage.totalCount || 0 ),
            pageSize: _state.detailPage.pageSize,
            showSizeChanger: true,
            pageSizeOptions: _state.detailPage.pageSizeOptions,
            current: _state.detailPage.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({
                    detailPage: {...this.state.detailPage, pageNum: 1},
                    pageSize
                }, this.renderDetailTable)
            },
            onChange: (value, pageSize) => {
                this.setState({
                    detailPage: {...this.state.detailPage, pageNum: value},
                    pageSize
                }, this.renderDetailTable)
            }
        }
        return (
            <Modal
                title="消息详情"
                visible={this.state.showDetail}
                onCancel={this.cancelDetail}
                width="70%"
            >
                <Table
                    bordered
                    columns={columns}
                    dataSource={checkKey(this.state.messageList)}
                    rowKey="id"
                    onChange={this.handleSortDetailChange}
                    pagination={pageObj}
                    loading={this.state.loadingDetail}
                />
            </Modal>
        )
    }
    render () {
        const _state = this.state
        const columns = [
            {
                title: '消息ID',
                dataIndex: 'id',
                key: 'id',
                width: '150px'
            },
            {
                title: '消息类型',
                dataIndex: 'type',
                key: 'type',
                width: '150px'
            },
            {
                title: '用户',
                dataIndex: 'nickName',
                key: 'nickname',
                width: '150px',
                render: (nickname, record) => (
                    <Button
                        type="primary"
                        name="lookPick"
                        className="mr-sm"
                        size="small"
                        id={record.userId}
                        onClick={this.showUserInfomation}
                    >
                        <span dangerouslySetInnerHTML={{__html: nickname}}></span>
                    </Button>
                )
            },
            {
                title: '发消息时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '300px',
                sorter: true,
                render: val => <span>{dataFormat(val - 0, 'YYYY-MM-DD HH:mm:ss')}</span>
            },
            {
                title: '操作',
                dataIndex: 'action',
                width: '300px',
                render: (v, record) => {
                    return (
                        <Button
                            className="mr-sm"
                            type="primary"
                            size="small"
                            name="stop"
                            onClick={this.detail(record)}
                        >消息详情</Button>
                    )
                }
            }
        ]
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
                <Table
                    bordered
                    columns={columns}
                    dataSource={_state.tableData}
                    rowKey="key"
                    onChange={this.handleSortChange}
                    pagination={pageObj}
                    loading={this.state.isLoading}
                />
                {this.renderDetailModal()}
                {this.renderCustomerModal()}
                {this.renderTemplateModal()}
                {this.renderUesrModal()}
            </div>
        )
    }
}

export default connect(mapStateToProps)(WeixinMessageRecord)