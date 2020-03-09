import React, { PureComponent } from 'react'
import { Modal, Form, Input } from 'antd'
const FormItem = Form.Item
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


class GrounpDartpment extends PureComponent {
    constructor () {
        super();
        this.onOk = this.onOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.resetFields = this.resetFields.bind(this);
    }
    onOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.handleOk(values)
            }
        })
    }
    handleCancel = () =>{
        this.props.handleCancel()
    }
    resetFields = () =>{
        this.props.form.resetFields()
    }
    render () {
        const { visible, title, label, paramsName, editContent } = this.props;
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                title={title}
                visible={visible}
                onOk={this.onOk}
                onCancel={this.handleCancel}
                afterClose={this.resetFields}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label={label}
                    >
                        {getFieldDecorator(paramsName, {
                            initialValue: editContent ? editContent : '',
                            rules: [{ required: true, message: `请输入${label}` }]
                        })(
                            <Input placeholder={`请输入${label}`} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
GrounpDartpment = Form.create()(GrounpDartpment)
export default GrounpDartpment