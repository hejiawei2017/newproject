import React, {Component} from 'react'
import { Modal, Form, Input } from 'antd'

const FormItem = Form.Item

class BatchFormModal extends Component {
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
        this.setState({
            visible: false
        }, () => {
            this.props.stateChange({batchType: false})
        })
    }
    onModalOk = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('表单---->', values)
                this.props.onSubmit(values)
            }
        })
    }
    render () {
        const {
            visible
        } = this.props
        const { getFieldDecorator } = this.props.form
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
        return (
            <Modal
                title="批量修改合同签约人姓名"
                visible={visible}
                width={700}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
            >
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="合同编码"
                    >
                        {getFieldDecorator('contractNumberStr', {
                            rules: [{ required: true, message: '请输入合同编码!' }]
                        })(
                            <Input placeholder="请输入合同编码（多个用 “，” 隔开）" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="签约人姓名"
                    >
                        {getFieldDecorator('signName', {
                            rules: [{ required: true, message: '请输入签约人姓名!' }]
                        })(
                            <Input placeholder="请输入签约人姓名" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const BatchModal = Form.create()(BatchFormModal)
export default BatchModal