import React, { Component } from 'react'
import { Modal, Form, InputNumber, message } from 'antd'
import {connect} from "react-redux";

const FormItem = Form.Item

@connect(state => ({
    currentOrder: state.order.currentOrder
}))
class SetFormModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
        }
    }
    handleCancel = () => {
        this.props.stateChange({isShowCancleOrder: false})
    }
    onModalOk = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (err) {
                err = err.totalPrice.errors
                message.error(err[0].message)
            }else{
                this.props.onSubmit(values)
            }
        })
    }
    render () {
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
        const { currentOrder } = this.props
        const { orderCostDetailView } = currentOrder
        const { totalPrice } = orderCostDetailView
        return (
            <Modal
                title="取消订单"
                visible
                width={500}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
            >
                <div className="lh16">{currentOrder.paymentTerm === 1 ? `取消订单后立即释放房态，已支付费用${currentOrder.amount}元将原路退回。` : '取消订单后立即释放房态。'}</div>
                {/* <Form>
                    <FormItem
                        {...formItemLayout}
                        label="退款金额"
                    >
                        {getFieldDecorator('totalPrice', {
                            rules:
                                [
                                    { required: true, message: '金额不能为空' },
                                    { validator (rule, value, callback) {
                                            if(value == null){
                                                callback()
                                                return
                                            }else if(value.length > 8) {
                                                callback('金额不可大于8位数')
                                            }else if(value > totalPrice) {
                                                callback('退款金额不可大于原订单金额')
                                            }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                                callback('金额输入有误')
                                            }else{
                                                callback()
                                            }
                                        }
                                    }
                                ]
                        })(
                            <InputNumber precision = {2}/>
                        )}
                        <div className="lh16">原订单金额（即最高限额）：￥{totalPrice}</div>
                    </FormItem>
                </Form> */}
            </Modal>
        )
    }
}

const SetModal = Form.create()(SetFormModal)
export default SetModal
