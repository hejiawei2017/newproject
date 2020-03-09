import React, { Component } from 'react'
import { Switch, Modal, Form, Input, Radio, InputNumber, message } from 'antd'
import './depositModal.less'
import * as API from 'services'
import { connect } from 'react-redux'
import {
    getOrderDetail
} from '../../actions/order'
import { dataFormat } from '../../utils/utils';

const FormItem = Form.Item
const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const confirm = Modal.confirm

const compensationOptions = [
    { label: '无需索赔', value: 4 },
    { label: '需要索赔', value: 5 }
]

@connect(({ order }) => ({
    currentOrder: order.currentOrder
}))
@Form.create()
export default class DepositModal extends Component {
    state = {
        depositStatus: 0
    }

    handleOk = e => {
        const { mode } = this.props
        e.preventDefault()

        if (mode === 'frozen')
            this.confirmFrozenDeposit()
        else if (mode === 'edit')
            this.confirmUnfrozenDeposit()
        else
            this.handleCancel(false)
    }

    confirmFrozenDeposit = () => {
        const { currentOrder } = this.props
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values['orderNo'] = currentOrder.bookingId
                values['depositStatus'] = this.state.depositStatus

                if (!values['depositStatus']) {
                    message.info('请切换冻结至「冻结保证金」状态')
                    return false
                }

                API.orderService.setDepositFrozen(values)
                    .then(() => {
                        this.handleCancel(true)
                    })
                    .catch(err => {
                        message.error(err)
                    })

            }
        })
    }

    confirmUnfrozenDeposit = () => {
        const { currentOrder } = this.props
        const isNeedCompensation = this.props.form.getFieldValue('refundType') === 5
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values['orderNo'] = currentOrder.bookingId
                values['refundPrice'] = isNeedCompensation ? values.refundPrice : (currentOrder.orderCostDetailView && currentOrder.orderCostDetailView.depositPrice)

                if (!values['isDepositFrozen']) {
                    message.info('请切换至「解冻保证金」状态')
                    return false
                }
                delete values['isDepositFrozen']

                if (!isNeedCompensation) {
                    this.handleCompensation(values)
                } else {
                    this.showPreConfirm(() => {
                        this.handleCompensation(values)
                    })
                }

            }
        })
    }

    handleCompensation = payload => {
        API.orderService.setDepositUnfrozen(payload)
            .then(() => {
                if (this.props.form.getFieldValue('refundType') === 5) {
                    this.showAfterConfirm()
                } else {
                    this.handleCancel(true)
                }
            })

    }

    showAfterConfirm = () => {
        const modal = Modal.success({
            title: '退款操作已完成~请及时反馈给客户~',
            onOk: () => {
                this.handleCancel(true)
                modal.destroy()
            }
        })
    }

    showPreConfirm = (okCb, cancelCb) => {
        confirm({
            centered: true,
            title: '继续前请务必确认退款项与所对应的退款金额无误，以免造成损失~',
            onOk: () => {
                okCb && okCb()
            },
            onCancel: () => {
                cancelCb && cancelCb()
            }
        })
    }

    handleCancel = (needRequest) => {
        const { dispatch, currentOrder } = this.props
        if (needRequest) {
            dispatch(getOrderDetail(currentOrder.bookingId)).then(() => {
                this.props.toggleDepositModal()
                this.props.form.resetFields()
            })
        } else {
            this.props.toggleDepositModal()
            this.props.form.resetFields()
        }
    }

    toggleDepositStatus = val => {
        this.setState({
            depositStatus: Number(val)
        })
    }

    renderDepositCom = mode => {
        const { currentOrder } = this.props
        const { orderRefundView } = currentOrder
        const { getFieldDecorator } = this.props.form
        const depositReund = orderRefundView && orderRefundView.refundViewList.find(item => item.refundItemType === '7')
        const refundDepositPrice = depositReund && depositReund.refundPrice

        return mode === 'frozen'
            ? (
                <React.Fragment>
                    <FormItem
                        label="冻结保证金"
                    >
                        <Switch defaultChecked={false} onChange={this.toggleDepositStatus} />
                    </FormItem>
                    <FormItem
                        label="冻结原因"
                    >
                        {getFieldDecorator('depositFrozenReason', {
                            rules: [{ required: true, message: '请输入冻结保证金原因' }]
                        })(
                            <TextArea placeholder="请输入冻结保证金原因" />
                        )}
                    </FormItem>
                </React.Fragment>
            )
            : (
                <React.Fragment>
                    <FormItem >
                        <ul className="deposit-unfrozen-info">
                            <li>
                                保证金金额：{currentOrder.orderCostDetailView && currentOrder.orderCostDetailView.depositPrice} 元
                            </li>
                            {
                                mode === 'display' && (
                                    <li>
                                        <strong>已退还：{refundDepositPrice || 0} 元</strong>
                                    </li>
                                )
                            }
                            <br />
                            <li>
                                保证金状态：{currentOrder.depositStatus === 1 ? '已冻结' : '未冻结'}
                            </li>
                            <li>
                                冻结原因：{currentOrder.depositFrozenReason}
                            </li>
                            <li>
                                冻结人：{currentOrder.depositCreator}
                            </li>
                            <li>
                                冻结时间：{dataFormat(currentOrder.depositTime, 'YYY-MM-DD HH:mm:ss')}
                            </li>
                        </ul>
                    </FormItem>
                    {
                        mode === 'edit' && (
                            <React.Fragment>
                                <FormItem
                                    label="解冻保证金"
                                >
                                    {getFieldDecorator('isDepositFrozen', {
                                        initialValue: 0,
                                        rules: [{ required: true, message: '请选择是否解冻保证金' }],
                                        valuePropName: 'checked'
                                    })(
                                        <Switch />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {
                                        getFieldDecorator('refundType', {
                                            initialValue: 4
                                        })(
                                            <RadioGroup>
                                                {
                                                    compensationOptions.map((opt, index) => (
                                                        <Radio key={opt.label + '-' + index + new Date().getTime()} value={opt.value}>
                                                            {opt.label}
                                                        </Radio>
                                                    ))
                                                }
                                            </RadioGroup>
                                        )
                                    }
                                </FormItem>
                                {
                                    this.props.form.getFieldValue('refundType') === 4
                                        ? null
                                        : (
                                            <React.Fragment>
                                                <FormItem
                                                    label="异议描述"
                                                >
                                                    {getFieldDecorator('reason', {
                                                        rules: [{ required: true, message: '请输入冻结保证金原因' }]
                                                    })(
                                                        <TextArea
                                                            autosize={{ minRows: 1, maxRows: 6 }}
                                                            placeholder="请输入异议描述"
                                                        />
                                                    )}
                                                </FormItem>
                                                <FormItem
                                                    label="处理意见"
                                                >
                                                    {getFieldDecorator('checkRemark', {
                                                        rules: [{ required: true, message: '请输入处理意见' }]
                                                    })(
                                                        <TextArea
                                                            autosize={{ minRows: 1, maxRows: 6 }}
                                                            placeholder="请输入处理意见"
                                                        />
                                                    )}
                                                </FormItem>
                                                <FormItem
                                                    label="退还保证金金额"
                                                >
                                                    {getFieldDecorator('refundPrice', {
                                                        initialValue: 0,
                                                        rules: [{ required: true, message: '请输入处理意见' }]
                                                    })(
                                                        <InputNumber min={0} max={currentOrder.orderCostDetailView && currentOrder.orderCostDetailView.depositPrice} />
                                                    )}
                                                </FormItem>
                                            </React.Fragment>
                                        )
                                }
                            </React.Fragment>
                        )
                    }
                </React.Fragment>
            )
    }

    render = () => {
        const { mode, visible } = this.props
        const self = this
        return (
            <Modal
                className="deposit-modal"
                title={mode === 'frozen' ? '冻结保证金' : '保证金异常处理'}
                visible={visible}
                onOk={this.handleOk}
                onCancel={function () { self.handleCancel(false) }}
            >
                <Form>
                    {this.renderDepositCom(mode)}
                </Form>
            </Modal>
        )
    }
}