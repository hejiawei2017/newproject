import React, { Component } from 'react'
import { Input, Modal, Form } from 'antd'
import PropTypes from 'prop-types';
const FormItem = Form.Item

class EditModal extends Component {
    static propTypes = {
        labelModalSave: PropTypes.func,
        handleSubmit: PropTypes.func,
        stateChange: PropTypes.func,
        form: PropTypes.object,
        formParams: PropTypes.object,
        editModalVisible: PropTypes.bool,
        editType: PropTypes.string
    }
    constructor (props) {
        super(props)
        this.state = {
            formParams : props.formParams
        }
        this.handleCancel = this.handleCancel.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        this.setState({formParams: nextProps.formParams});
    }
    handleCancel () {
        this.props.stateChange({editModalVisible: false})
    }
    render () {
        let that = this
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
                visible={this.props.editModalVisible}
                title={this.props.editType === 'add' ? '新增供应商' : '修改供应商'}
                onOk={function () {
                    that.props.handleSubmit(that.state.formParams)
                }}
                onCancel={this.handleCancel}
                cancelText="关闭"
                okText="保存"
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="供应商名称"
                    >
                        {getFieldDecorator('name', {
                            initialValue: this.state.formParams.name,
                            rules: [{ required: true, message: '供应商名称不能为空' }]
                        })(
                            <Input placeholder="请输入供应商名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="供应商公司全称"
                    >
                        {getFieldDecorator('companyName', {
                            initialValue: this.state.formParams.companyName,
                            rules: [{ required: true, message: '供应商公司全称不能为空' }]
                        })(
                            <Input placeholder="请输入供应商公司全称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="供应商联系人"
                    >
                        {getFieldDecorator('contactName', {
                            initialValue: this.state.formParams.contactName,
                            rules: [{ required: true, message: '供应商联系人不能为空' }]
                        })(
                            <Input placeholder="请输入供应商联系人" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="供应商联系方式"
                    >
                        {getFieldDecorator('phone', {
                            initialValue: this.state.formParams.phone,
                            rules: [{ required: true, message: '供应商联系方式不能为空' }]
                        })(
                            <Input placeholder="请输入供应商联系方式" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default EditModal