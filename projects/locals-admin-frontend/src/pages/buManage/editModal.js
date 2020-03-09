import React, { Component } from 'react'
import { Input, Modal, Form, InputNumber } from 'antd'

const FormItem = Form.Item

class EditModal extends Component {
    constructor () {
        super()
        this.state = {
            houseNo: null,
            workBookName: null,
            buId: null,
            memberCode: null,
            editModalVisible: true,
            editType: null
        }
        this.handleCancel = this.handleCancel.bind(this)
        this.onModalOk = this.onModalOk.bind(this)
    }
    componentDidMount () {
        this.setState({
            houseNo: this.props._data.houseNo,
            workBookName: this.props._data.workBookName,
            buId: this.props._data.buId,
            memberCode: this.props._data.memberCode,
            editType: this.props.editType
        })
    }
    onModalOk () {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.submitForm(values)
            }
        })
    }
    submitForm (val) {
        this.props.labelModalSave(val)
    }
    handleCancel () {
        this.setState({
            editModalVisible: false
        }, ()=>{
            this.props.stateChange({editModalVisible: false})
        })
    }
    render () {
        let _state = this.state
        const { getFieldDecorator } = this.props.form
        const nameRequired = (this.props.editType === 'add') ? true : false
        const disabled = (this.props.editType === 'add' ? false : true)
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
                title={_state.editType === 'add' ? '新增' : '编辑'}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
                cancelText="关闭"
                okText="保存"
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="房源编号"
                    >
                        {getFieldDecorator('houseNo', {
                            initialValue: _state.houseNo,
                            rules: [{ required: true, message: '请输入房源编号!' }]
                        })(
                            <Input placeholder="请输入房源编号" disabled={disabled} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="BU名称"
                    >
                        {getFieldDecorator('workBookName', {
                            initialValue: _state.workBookName,
                            rules: [{ required: nameRequired, message: '请输入BU名称!' }]
                        })(
                            <Input placeholder="请输入BU名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="BUID"
                    >
                        {getFieldDecorator('buId', {
                            initialValue: _state.buId,
                            rules: [{ required: true, message: '请输入BUID!' }]
                        })(
                            <InputNumber placeholder="请输入BUID" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="人员编号	"
                    >
                        {getFieldDecorator('memberCode', {
                            initialValue: _state.workBookName,
                            rules: [{ required: false, message: '请输入人员编号!' }]
                        })(
                            <Input placeholder="请输入人员编号（选填）" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

EditModal = Form.create()(EditModal)
export default EditModal