import React, { Component } from 'react'
import { Input, InputNumber, Modal, Form } from 'antd'
const FormItem = Form.Item

class EditLabelModal extends Component {
    constructor () {
        super()
        this.state = {
            id: '',
            name: '',
            orderNumber: 1,
            description: '',
            editModalVisible: true
        }
        // this.submitForm = this.submitForm.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.onModalOk = this.onModalOk.bind(this)
    }
    componentDidMount (){
        this.setState({
            id:this.props._data.id,
            name:this.props._data.name,
            orderNumber:this.props._data.orderNumber,
            description:this.props._data.description
        })
    }
    handleCancel () {
        this.setState({
            editModalVisible: false
        },()=>{
            this.props.stateChange({editModalVisible: false})
        })
    }
    onModalOk (e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.submitForm(values)
            }
        })
    }
    submitForm (values) {
        const params = {...values}
        if(this.props.editType !== 'add'){
            params.id = this.state.id
        }
        this.props.labelModalSave(params)
    }
    render () {
        const _state = this.state
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
                visible={_state.editModalVisible}
                title={_state.editType === "add" ? '新增标签' : '编辑标签'}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
                cancelText="关闭"
                okText="保存"
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="标签名称"
                    >
                        {getFieldDecorator('name', {
                            initialValue: _state.name,
                            rules: [{ required: true, message: '请输入标签名称!' }]
                        })(
                            <Input placeholder="请输入标签名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="排序"
                    >
                        {getFieldDecorator('orderNumber', {
                            initialValue: _state.orderNumber,
                            rules: [{ required: true, message: '请输入标签排序数字!' }]
                        })(
                            <InputNumber className="mr10" />
                        )}
                        <span>数值越大越靠前</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="描述"
                    >
                        {getFieldDecorator('description', {
                            initialValue: _state.description
                        })(
                            <Input.TextArea rows={3} placeholder="[可选]请输入描述" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

EditLabelModal = Form.create()(EditLabelModal)
export default EditLabelModal