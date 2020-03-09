import React, { Component } from 'react'
import { Modal, Form, InputNumber, message } from 'antd'

const FormItem = Form.Item

class DelFormModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.visible === false) {
            // console.log('设置--->', nextProps.data)
            this.onReset()
        }
    }
    onReset = () => {
        this.props.form.resetFields()
    }
    handleCancel = () => {
        this.props.stateChange({isShowDelOrder: false})
    }
    onModalOk = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            let fields = {}
            values.repayPrice && (fields.repayPrice = values.repayPrice)
            fields.randomId = this.props.data.randomId
            this.props.onSubmit(fields)
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
                title="删除途家API订单"
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
                        <div className="ant-span-red lh16">（若无需返款给房东则金额不填或填0）</div>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const DelModal = Form.create()(DelFormModal)
export default DelModal