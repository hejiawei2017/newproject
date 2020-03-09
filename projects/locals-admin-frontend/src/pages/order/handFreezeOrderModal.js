import React, { Component } from 'react'
import { connect } from "react-redux"
import { Modal, Form, Input, Radio , Button, Divider, Col, message } from 'antd'
import './handworkOrderModal.less'
import { freezeServer } from '../../services'
import * as API from 'services'

const FormItem = Form.Item
const confirm = Modal.confirm
const Fragment = React.Fragment
@Form.create()

@connect(state => ({
    orderIdOrder: state.order.orderIdOrder
}))

export default class haneFreezeOrder extends Component {

    constructor (props) {
        super(props)
        this.state = {
            onSubStatus: false
        }
    }

    handleOk = e => {
        e.preventDefault()
        this.setState({
            onSubStatus: true
        })
        this.confirmApproval()
    }

    confirmApproval = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.operaFreeze(values);
            } else {
                this.setState({
                    onSubStatus: false
                })
            }
        })
    }

    operaFreeze = (values) => { //操作冻结保证金
        const { orderIdOrder } = this.props
        values.tujiaOrderNo = orderIdOrder.apiOrderId;
        console.log(values,"values")
        freezeServer.postFreezeStatus(values).then((data)=>{
            console.log(data,"data")
            this.setState({
                onSubStatus: false
            })
            this.showAfterConfirm()
        }).catch(err=>{
            message.error(JSON.stringify(err))
            this.setState({
                onSubStatus: false
            })
        })
    }

    showAfterConfirm = () => {
        const modal = Modal.success({
            title: '操作成功！',
            // title: data,
            onOk: () => {
                this.handleCancel()
                modal.destroy()
            }
        })
    }

    showPreConfirm = (okCb, cancelCb) => {
        confirm({
            centered: true,
            title: '确认操作',
            onOk: () => {
                okCb && okCb();
            },
            onCancel: () => {
                cancelCb && cancelCb()
            }
        })
    }

    handleCancel = () => {
        this.props.toggleHandleFreezeModal()
        this.setState({
            onSubStatus: false
        })
        this.props.form.resetFields()
    }

    render = () => {
        const { visible, form, orderCostDetailView } = this.props
        const { getFieldDecorator } = form
        const { onSubStatus } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        }

        return (
            <Modal
                width={360}
                className="handwork-order-modal"
                title={'冻结保证金'}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                wrapClassName={'freeze_modal'}
                key="haneFreezeOrder"
                footer={[
                    <div className="freezeFooter" key="footerBox">
                        <Button key="submit" loading={onSubStatus} type="primary" onClick={this.handleOk}>
                            提交
                        </Button>
                        <Button key="back" onClick={this.handleCancel}>取消</Button>
                    </div>
                ]}
            >
                <Form >
                    {
                        <Fragment>
                            <FormItem
                            {...formItemLayout}
                            label="冻结金额"
                            >
                                {getFieldDecorator('amount', {
                                    rules: [
                                        { required: true, message: '请输入保证金冻结金额' },
                                        { validator (rule, value, callback) {
                                            if(value > orderCostDetailView.depositPrice){
                                                callback("请勿输入大于保证金的金额")
                                            }else{
                                                callback()
                                            }
                                        }}
                                    ]
                                })(
                                    <Input placeholder={orderCostDetailView.depositPrice} />
                                )}
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                            label="冻结原因"
                            >
                                {getFieldDecorator('reason', {
                                    rules: [{ required: true, message: '请输入保证金冻结原因' }]
                                })(
                                    <Input placeholder="请输入保证金冻结原因" />
                                )}
                            </FormItem>
                        </Fragment>
                    }
                </Form>
            </Modal>
        )
    }
}