import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, message, Button, Popconfirm, notification, Icon, Tooltip} from 'antd'
import MyUpload from '../../components/upload'
import { invoiceManageService, uploadImportService, orderService } from '../../services'
import {createUUID,dataFormat, envConfig} from '../../utils/utils'
import {sourseType, orderStatusType, payType} from 'utils/dictionary'

const FormItem = Form.Item

const uploadConfig = {
    upload : {
        action: uploadImportService.action,
        uploadType: 'file',
        limitType: "application/pdf",
        format: 'pdf'
    },
    needBtn : false
}

class EditModal extends Component {
    constructor () {
        super()
        this.state = {
            editForm: {},
            editModalVisible: true,
            modalType: '',
            invoiceInfo: null,
            title: '',
            footType: null,
            moreBtn: false,
            pdfUrl: '',
            orderDetail: {}
        }
        this.onModalOk = this.onModalOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.invoiceUpload = this.invoiceUpload.bind(this)
        this.upload = this.upload.bind(this)
        this.renderTitle = this.renderTitle.bind(this)
        this.getContent = this.getContent.bind(this)
        this.editExpress = this.editExpress.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.sendUrl = this.sendUrl.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    componentDidMount () {
        let type = this.props._data.type
        switch (type) {
        case 'edit':
            this.setState({
                title: '快递单号录入/修改',
                footType: [<Button key="cancel" onClick={this.handleCancel}>取消</Button>, <Button key="confirm" type="primary" onClick={this.onModalOk}>确认</Button>]
            })
            break
        case 'pdf':
            this.setState({
                title: '发票上传/修改',
                footType: null
            })
            break
        case 'detail':
            this.setState({
                title: '详情',
                footType: null
            })
            break
        default: return ''
        }
        this.setState({
            editForm: this.props._data
        })
    }
    onModalOk (e) {
        e.preventDefault()
        switch (this.state.editForm.type) {
        case 'edit':
            this.submitForm()
            return
        case 'pdf':
            return
        case 'detail':
            return
        default:
            return ''
        }
    }
    handleCancel () {
        this.setState({
            editModalVisible: false
        }, this.props.stateChange({editModalVisible: false}))
    }
    submitForm (val) {
        this.props.form.validateFields((err, values) => {
            let params = {
                id : this.state.editForm.id,
                expressNumber : values.expressNumber
            }
            invoiceManageService.addExpress(params).then((res) => {
                this.setState({
                    editModalVisible: false
                }, this.props.stateChange({editModalVisible: false}))
                message.success('操作成功')
                this.props.labelModalSave()
            }).catch((e) => {})
        })
    }
    editExpress () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 }
            }
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="快递单号录入/修改"
                >
                    {getFieldDecorator('expressNumber', {
                        rules: [{ required: true, message: '请输入快递单号!' }]
                    })(
                        <Input placeholder="请输入快递单号" />
                    )}
                </FormItem>
            </Form>
        )
    }
    handleChange (data, fun) {
        uploadImportService.upload(data.file, createUUID('xxxxxxxxxxxxxxxx', 10)).then((data) => {
            fun && fun()
            this.sendUrl(envConfig.newImagePrefix + data.filePath)
            this.props.uploadFun()
        }).catch((e) => {
            fun && fun()
            message.error('上传失败')
        })
    }
    sendUrl (url) {
        let params = {
            id : this.state.editForm.id,
            url : url
        }
        invoiceManageService.addInvoiceURL(params).then((res) => {
            this.setState({
                editModalVisible: false
            }, this.props.stateChange({editModalVisible: false}))
            message.success('操作成功')
        }).catch((e) => {})
    }
    invoiceUpload () {
        return (
            <MyUpload onUpload={this.handleChange} config={uploadConfig} />
        )
    }
    getType (val) {
        switch (val) {
        case 1:
            return '电子普通发票'
        case 2:
            return '纸质普通发票'
        case 3:
            return '专用票'
        default: return ''
        }
    }
    renderTitle () {
        let _props = this.props._data
        if (this.state.titleType === 1) {
            return (
                <div>
                    <Row className="pt5">
                        <Col span={12}>发票类型：{this.getType(_props.detail.invoiceType)}</Col>
                        <Col span={12}>收件人：{_props.detail.username}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>抬头类型：个人</Col>
                        <Col span={12}>联系电话：{_props.detail.phoneNumber}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>发票抬头：{_props.detail.titleName}</Col>
                        <Col span={12}>邮寄地址：{_props.detail.address}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>电子邮箱：{_props.detail.email}</Col>
                    </Row>
                </div>
            )
        } else {
            return (
                <div>
                    <Row className="pt5">
                        <Col span={12}>发票类型：{this.getType(_props.detail.invoiceType)}</Col>
                        <Col span={12}>电子邮箱：{_props.detail.email}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>抬头类型：{(_props.detail.titleType === 1) ? '个人' : '企业'}</Col>
                        <Col span={12}>收件人：{_props.detail.username}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>发票抬头：{_props.detail.titleName}</Col>
                        <Col span={12}>联系电话：{_props.detail.phoneNumber}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>纳税人识别号：{_props.detail.taxCode}</Col>
                        <Col span={12}>邮寄地址：{_props.detail.address}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>公司注册地址：{_props.detail.registeredAddress}</Col>
                        <Col span={12}>公司注册电话：{_props.detail.registeredPhoneNum}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>开户银行：{_props.detail.depositBank}</Col>
                        <Col span={12}>银行账号：{_props.detail.bankAccount}</Col>
                    </Row>
                </div>
            )
        }
    }
    sendEmail (id) {
        invoiceManageService.sendEmail(id).then((data)=>{
            notification.success({message:'发送成功！'})
            this.renderTable()
        })
    }
    getSendEmail () {
        let self = this
        if (this.props._data.detail.url){
            return (
                <Popconfirm title="发送邮件" className="ml10" key="email" onConfirm={function (){self.sendEmail(self.props._data.id)}} okText="确认" cancelText="取消">
                    <Button size="small" className="mr-sm ml10" type="primary">发送邮件</Button>
                </Popconfirm>
            )
        }else{
            return ''
        }
    }
    renderOrderDetail () {
        let _state = this.state
        let {orderDetail} = this.state

        return (
            <div>
                <Row className="pt5">
                    <Col span={12}>付款状态：{orderDetail.payStatus === "0" ? "未付款" : orderDetail.payStatus === "1" ? "已付款" : null }</Col>
                    <Col span={12}>付款方式：{payType[orderDetail.payType]}</Col>
                </Row>
                <Row className="pt5">
                    <Col span={12}>预定状态：{orderStatusType[orderDetail.orderStatus]}</Col>
                    <Col span={12}>订单来源：{sourseType[_state.orderDetail.source]}</Col>
                </Row>
                <Row className="pt5">
                    <Col span={12}>创建时间：{dataFormat(_state.orderDetail.createTime, 'YYYY-MM-DD HH:mm:ss')}</Col>
                    <Col span={12}>预订日期：{dataFormat(_state.orderDetail.bookingDate, 'YYYY-MM-DD HH:mm:ss')}</Col>
                </Row>
                <Row className="pt5">
                    <Col span={12}>入住日期：{dataFormat(_state.orderDetail.checkinDate, 'YYYY-MM-DD HH:mm:ss')}</Col>
                    <Col span={12}>离店日期：{dataFormat(_state.orderDetail.checkoutDate, 'YYYY-MM-DD HH:mm:ss')}</Col>
                </Row>
                <Row className="pt5">
                    <Col span={12}>折扣金额：{_state.orderDetail.discountAmount}</Col>
                    <Col span={12}>保证金：{orderDetail.orderCostDetailView && orderDetail.orderCostDetailView.depositPrice}</Col>
                </Row>
                <Row className="pt5">
                    <Col span={12}>房费：{orderDetail.orderCostDetailView && orderDetail.orderCostDetailView.roomPrice}</Col>
                    <Col span={12}>支付总费用：{orderDetail.orderCostDetailView && orderDetail.orderCostDetailView.totalPrice}</Col>
                </Row>
                <Row className="pt5">
                    <Col span={12}>清洁费：{orderDetail.orderCostDetailView && orderDetail.orderCostDetailView.clearPrice}</Col>
                    <Col span={12}>客人实际付款总金额：{orderDetail.hasPay}</Col>
                </Row>
                <Row className="pt5">
                    <Col span={12}>会员折扣：{orderDetail.orderCostDetailView && orderDetail.orderCostDetailView.memberDiscount}</Col>
                </Row>
            </div>
        )
    }
    upload (e) {
        let id = e.target.id
        this.props.stateChange({editForm: {type: 'pdf',id: id}, editModalVisible: true})
    }
    showInvoiceDetail () {
        let _this = this
        let _props = this.props._data
        return (
            <div>
                <div className="bb pb5">
                    <Row className="fs15">订单信息</Row>
                    <Row className="pt5">
                        <Col span={12}>姓名：{_props.detail.bookingUsername}</Col>
                        <Col span={12}>手机号码：{_props.detail.bookingPhoneNumber}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>行程单号：{_props.detail.tripCode}</Col>
                        <Col span={12}>订单状态：   {['未完成','已完成'][_props.detail.bookingStatus]}</Col>
                    </Row>
                    {this.state.moreBtn ? this.renderOrderDetail() : <Button className="mr-sm mt10" type="primary" size="small" onClick={function (){_this.showOrderDetail()}} >更多</Button>}
                    {(_props.detail.bookingStatus === 1 && _props.detail.invoiceType === 1 && _props.detail.invoiceStatus === 0) ? <Button className="mr-sm mt10" type="primary" size="small" id={_props.detail.id} onClick={_this.upload}>发票上传</Button> : null}
                </div>
                <div className="mt10 bb pb5">
                    <Row className="fs15">发票信息</Row>
                    {this.renderTitle()}
                </div>
                <div className="mt10 bb pb5">
                    <Row className="fs15">费用信息</Row>
                    <Row className="pt5">
                        <Col span={12}>
                            <Tooltip placement="top" title={'开票金额=预定总费用（已包含发票服务费）'}>
                                开票金额（预订总费用） <Icon type="exclamation-circle-o" /> ：{_props.detail.orderPrice}
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip placement="top" title={'发票服务费=(房费总价格+清洁费-会员折扣-优惠卷减免金额)*0.06'}>
                                发票服务费： <Icon type="exclamation-circle-o" />：{_props.detail.servicePrice}
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>
                            <Tooltip placement="top" title={'剩余开票金额=原预订总费用-退还房费-退还清洁费-退还发票服务费'}>
                                剩余开票金额 <Icon type="exclamation-circle-o" />：{_props.detail.surplusInvoicePrice}
                            </Tooltip>
                        </Col>
                    </Row>
                </div>
                <div className="mt10 bb pb5">
                    <Row className="fs15">电子发票</Row>
                    <Row className="pt5">地址：<a href={_props.detail.url} target="view_window">{_props.detail.url}</a>{this.getSendEmail()}</Row>
                </div>
                <div className="mt10">
                    <Row className="fs15">快递单</Row>
                    <Row className="pt5">
                        <Col span={12}>快递单号：{_props.detail.expressNumber}</Col>
                    </Row>
                </div>
            </div>
        )
    }
    async showOrderDetail (){
        let params = {
            pageNum: 1,
            pageSize: 10,
            statusNotEqual:0,
            randomId:this.props._data.detail.tripCode
        }
        orderService.getOrderList(params).then((res) => {
            if(res.list.length === 0){
                message.warning('无法获取！')
            }else{
                this.setState({
                    orderDetail: res.list[0],
                    moreBtn: true
                }, message.loading('获取数据中...', 0))
            }
        }).catch( e =>{
            message.warning('无法获取！')
        })
        let orderList = await orderService.getOrderList(params).catch(e => message.warning(e))
        let orderDetail = await orderService.getOrderDetail(orderList.list[0].id).catch(e => message.warning(e))
        // console.log('d', {
        //         ...orderList[0],
        //         ...orderDetail
        // })
        this.setState({
            orderDetail: {
                ...orderList[0],
                ...orderDetail
            },
            moreBtn: true
        }, message.loading('获取数据中...', 0))
        // console.log('list', orderList.list[0])
        // console.log('res', orderDetail)
    }
    getContent () {
        let type = this.props._data.type
        switch (type) {
        case 'edit': return this.editExpress()
        case 'pdf': return this.invoiceUpload()
        case 'detail': return this.showInvoiceDetail()
        default: return ''
        }
    }
    render () {
        let _state = this.state
        return (
            <Modal
                visible={_state.editModalVisible}
                title={_state.title}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
                cancelText="取消"
                okText="确定"
                width={800}
                footer={_state.footType}
                style={{ top: 20 }}
            >{this.getContent()}
            </Modal>
        )
    }
}

EditModal = Form.create()(EditModal)
export default EditModal