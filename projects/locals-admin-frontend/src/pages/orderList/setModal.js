import React, { Component } from 'react'
import { Modal, Form, InputNumber, DatePicker, message } from 'antd'

const FormItem = Form.Item

class SetFormModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.visible === false) {
            this.onReset()
        }
    }
    onReset = () => {
        this.props.form.resetFields()
    }
    handleCancel = () => {
        this.props.stateChange({isShowSetOrder: false})
    }
    onModalOk = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            // if (!err) {
            //     console.log('表单---->', values)
            // }
            let filter = []
            let fields = {}
            for (let i in values) {
                if (values[i]) {
                    filter.push(values[i])
                    if (i === 'checkinDate' || i === 'checkoutDate') {
                        fields[i] = values[i].format('YYYY-MM-DD')
                    } else {
                        fields[i] = values[i]
                    }
                }
            }
            if (filter.length === 0) {
                message.info('请至少填写其中一项！')
            } else {
                fields.randomId = this.props.data.randomId
                this.props.onSubmit(fields)
            }
        })
    }
    render () {
        const {
            visible
        } = this.props
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
            <Modal
                title="修改API订单"
                visible={visible}
                width={800}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="金额"
                    >
                        {getFieldDecorator('repayPrice', {
                            rules: []
                        })(
                            <InputNumber />
                        )}
                        <div className="ant-span-red lh16">（返款给房东的金额为的订单总价扣掉佣金）</div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="入住日期"
                    >
                        {getFieldDecorator('checkinDate', {
                            rules: []
                        })(
                            <DatePicker format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="离店日期"
                    >
                        {getFieldDecorator('checkoutDate', {
                            rules: []
                        })(
                            <DatePicker format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const SetModal = Form.create()(SetFormModal)
export default SetModal