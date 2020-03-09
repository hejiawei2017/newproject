import React, {Component} from 'react'
import {Input, InputNumber, Form,Modal} from 'antd'
import {orderListService} from "../../services"
import {connect} from "react-redux"
import {message} from "antd/lib/index"
const FormItem = Form.Item
const { TextArea } = Input

const mapStateToProps = (state, action) => {
    return {
        orderListM: state.orderListM
    }
}
class OrderOperation extends Component {
    constructor (props) {
        super(props)
        const value = props.value || {}
        this.state = {
            depositPriceBack: value.depositPriceBack || 0,
            totalRefundPrice: value.totalRefundPrice || 0,
            dissentDesc:'',
            disposeDesc:'',
            changeDataLoad: false
        }
    }

    handleOk = (e) => {
        const _this = this
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            _this.props.form.resetFields()
            _this.setState({
                visible: false
            })
            if(_this.state.changeDataLoad){

                _this.getPicle(values.depositPriceBack).then(()=>{
                    _this.orderOperation(values)
                })
            }else{
                _this.orderOperation(values)
            }
        })
    }


    orderOperation = (obj) => {
        const params = {
            'bookingId': this.props.id,
            'dissentDesc': obj.dissentDesc,
            'disposeDesc': obj.disposeDesc,
            'depositPriceBack': obj.depositPriceBack,
            'totalRefundPrice': obj.totalRefundPrice
        }
        if(this.props.operationType === "orderCancel") {
            orderListService.orderCancel(params).then((data) => {
                this.props.dispatch({
                    type: 'OEDER_CANCEL_SUCCESS'
                })
                message.success('取消成功！')
                this.onCancel()
            })
        } else {
            orderListService.orderDissent(params).then((data) => {
                this.props.dispatch({
                    type: 'OEDER_CANCEL_SUCCESS'
                })
                message.success('处理成功！')
                this.onCancel()
            })
        }
    }
    changeTotalPicle = (e, depositPriceBack) => {
        const _this = this
        const params = {
            'bookingId': this.props.id,
            'depositPriceBack': e ? e.target.value : depositPriceBack
        }
        this.setState({
            changeDataLoad: true,
            depositPriceBack: params.depositPriceBack
        })
        orderListService.getCalInvoicePrice(params).then((data)=>{
            _this.props.form.setFieldsValue({
                totalRefundPrice: data.refundPrice
            })
            console.log('getFieldsValue', _this.props.form.getFieldsValue())
            _this.setState({
                changeDataLoad: false
            })
        })
    }
    getPicle = (depositPriceBack) => {
        let _this = this
        return new Promise(()=>{
            _this.changeTotalPicle(null, depositPriceBack)
        })
    }
    onCancel = () => {
        console.log('onCancel')
        this.setState({
            // depositPriceBack: '0',
            // totalRefundPrice: '0'
        }, ()=>{
            this.props.onCancel()
            // this.props.form.setFieldsValue({
            //     depositPriceBack: '0',
            //     totalRefundPrice: '0'
            // })
        })
    }
    render () {
        const { visible, form} = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span:18 }
            }
        }
        return (
            <Modal
                visible={visible}
                title={this.props.operationType === "orderCancel" ? "取消订单" : "退押金异议处理"}
                okText="确认"
                cancelText="取消"
                onCancel={this.onCancel}
                onOk={this.handleOk}
            >
                <Form>
                    <FormItem label="订单ID" {...formItemLayout}>
                        {getFieldDecorator('bookingId', {initialValue:this.props.id})(
                            <Input disabled placeholder="订单ID" />
                        )}
                    </FormItem>
                    <FormItem label="异议描述" {...formItemLayout}>
                        {getFieldDecorator('dissentDesc', {initialValue:this.state.dissentDesc})(
                            <TextArea placeholder="异议描述" autosize={{ minRows: 2, maxRows: 6 }} />
                        )}
                    </FormItem>
                    <FormItem label="处理结果意见" {...formItemLayout}>
                        {getFieldDecorator('disposeDesc', {initialValue:this.state.disposeDesc})(
                            <TextArea placeholder="处理结果意见" autosize={{ minRows: 2, maxRows: 6 }} />
                        )}
                    </FormItem>
                    <FormItem label="退款金额" {...formItemLayout}>
                        {getFieldDecorator('depositPriceBack', {initialValue:this.state.depositPriceBack})(
                            <InputNumber precision={0} placeholder="退款金额" onBlur={this.changeTotalPicle}/>
                        )}
                        {/* <InputNumber precision={0} placeholder="退款金额"  onBlur={this.changeTotalPicle} /> */}
                    </FormItem>
                    <FormItem label="总退款金额" {...formItemLayout}>
                        {getFieldDecorator('totalRefundPrice', {initialValue:this.state.totalRefundPrice})(
                            <Input placeholder="总退款金额" disabled />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

OrderOperation = Form.create()(OrderOperation)

export default connect(mapStateToProps)(OrderOperation)