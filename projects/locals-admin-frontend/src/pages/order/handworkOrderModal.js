import React, { Component } from 'react'
import { Modal, Form, Input, Radio } from 'antd'
import './handFreezeOrderModal.less'
import { dataFormat } from 'utils/utils';

const FormItem = Form.Item
const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const confirm = Modal.confirm
const Fragment = React.Fragment

const orderModifiedOptions = [
    { label: '同意撤销/修改', value: 1 },
    { label: '拒绝撤销/修改', value: 0 }
]

@Form.create()
export default class HandworkOrderModal extends Component {

    handleOk = e => {
        // const { mode } = this.props
        const mode = '待审核'
        e.preventDefault()

        if (mode === '待审核')
            this.confirmApproval()
        else
            this.handleCancel()
    }

    confirmApproval = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.showPreConfirm(this.showAfterConfirm)
            }
        })
    }

    showAfterConfirm = () => {
        const modal = Modal.success({
            title: '该订单已成功撤销/修改！',
            onOk: () => {
                this.handleCancel()
                modal.destroy()
            }
        })
    }

    showPreConfirm = (okCb, cancelCb) => {
        confirm({
            centered: true,
            title: '确认是否撤销/修改订单',
            onOk: () => {
                okCb && okCb()
            },
            onCancel: () => {
                cancelCb && cancelCb()
            }
        })
    }

    handleCancel = () => {
        this.props.toggleHandworkModal()
        this.props.form.resetFields()
    }

    renderHandworkCom = () => {
        // const { getFieldDecorator } = this.props.form
        // const mode = '待审批'
        return (
            <Fragment>
                <p className="handwork-order-header">
                    <span>某某某</span>
                    &nbsp;于&nbsp;
                    <span>{dataFormat(Date.now(), 'YYYY-MM-DD HH:mm:ss')}</span>
                    &nbsp;提交&nbsp;
                    <span><strong>撤销/修改</strong></span>
                    &nbsp;该订单申请。
                </p>
                <ul className="handwork-order-basic__info">
                    <li>支付总额：{1000}</li>
                    <li>入住日期：{dataFormat(Date.now(), 'YYYY-MM-DD HH:mm:ss')}</li>
                    <li>
                        退房日期：{dataFormat(Date.now(), 'YYYY-MM-DD HH:mm:ss')}
                    </li>
                    <li>
                        撤下/修改支付总额为：{1000}
                    </li>
                    <li>
                        撤销/修改入住日期为：{dataFormat(Date.now(), 'YYYY-MM-DD HH:mm:ss')}
                    </li>
                    <li>
                        撤销/修改退房日期为：{dataFormat(Date.now(), 'YYYY-MM-DD HH:mm:ss')}
                    </li>
                </ul>
                <ul className="handwork-order-reason">
                    <li>
                        <h2>撤销/修改原因：</h2>
                        <p>{'客人因个人原因申请离店'}</p>
                    </li>
                    <li>
                        <h2>具体原因备注：</h2>
                        <p>{'xxxx'}</p>
                    </li>
                    <li>
                        <h2>相关截图：</h2>
                        <a href={'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=13548081,3090048958&fm=27&gp=0.jpg'} target="__blank">
                            <img src={'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=13548081,3090048958&fm=27&gp=0.jpg'} alt={''} />
                        </a>
                        <a href={'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=13548081,3090048958&fm=27&gp=0.jpg'} target="__blank">
                            <img src={'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=13548081,3090048958&fm=27&gp=0.jpg'} alt={''} />
                        </a>
                    </li>
                </ul>
            </Fragment>
        )
    }

    render = () => {
        const { visible, form } = this.props
        const { getFieldDecorator } = form
        const mode = '待审批'

        return (
            <Modal
                width={1120}
                className="handwork-order-modal"
                title={'手工订单异常处理'}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form>
                    {this.renderHandworkCom()}
                    {
                        mode === '待审批' && (
                            <Fragment>
                                <FormItem>
                                    {getFieldDecorator('isAllowedModified', {
                                        initialValue: 1
                                    })(
                                        <RadioGroup>
                                            {
                                                orderModifiedOptions.map(item => (
                                                    <Radio value={item.value} key={item.label}>{item.label}</Radio>
                                                ))
                                            }
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                {
                                    !this.props.form.getFieldValue('isAllowedModified') && (
                                        <FormItem>
                                            {getFieldDecorator('content', {
                                                rules: [{ required: true, message: '请输入拒绝撤销/修改原因' }]
                                            })(
                                                <TextArea
                                                    autosize={{ minRows: 3 }}
                                                    placeholder="请输入拒绝撤销/修改原因"
                                                />
                                            )}
                                        </FormItem>
                                    )
                                }

                            </Fragment>
                        )
                    }
                </Form>
            </Modal>
        )
    }
}
