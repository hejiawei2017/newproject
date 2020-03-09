import React, { Component } from 'react'
import { Input, Modal, Form,Select } from 'antd'
const Option = Select.Option

const FormItem = Form.Item

class EditModal extends Component {
    constructor () {
        super()
        this.state = {
            description: null,
            authCode: null,
            id: null,
            module: null,
            method: null,
            innerInvoke: null,
            hash_code: null,
            uri: null,
            editModalVisible: true
        }
        this.handleCancel = this.handleCancel.bind(this)
        this.onModalOk = this.onModalOk.bind(this)
    }
    componentDidMount () {
        this.setState({
            description: this.props._data.description,
            authCode: this.props._data.authCode,
            id: this.props._data.id,
            module: this.props._data.module,
            hash_code: this.props._data.hash_code,
            innerInvoke: this.props._data.innerInvoke,
            method: this.props._data.method,
            uri: this.props._data.uri
        })
    }
    onModalOk () {
        let that = this
        that.props.form.validateFields((err, values) => {
            if (!err) {
                if(that.props.editType === 'add'){
                    that.submitForm(values,that.props.editType)
                }else{
                    values['id'] = that.state.id
                    that.submitForm(values,that.props.editType)
                }
            }
        })
    }
    submitForm (val,type) {
        this.props.labelModalSave(val,type)
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
                title={this.props.editType === 'add' ? '新增' : '编辑'}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
                cancelText="关闭"
                okText="保存"
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="URI"
                    >
                        {getFieldDecorator('uri', {
                            initialValue: _state.uri,
                            rules: [{ required: true, message: '例:/auth/wechat-open/binding!' }]
                        })(
                            <Input placeholder="请输入URI" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="方法"
                    >
                        {getFieldDecorator('method', {
                            initialValue: _state.method,
                            rules: [{ required: true, message: '请输入方法!' }]
                        })(
                            <Select>
                                <Option value="GET">GET</Option>
                                <Option value="POST">POST</Option>
                                <Option value="PUT">PUT</Option>
                                <Option value="DELETE">DELETE</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="可访问权限"
                    >
                        {getFieldDecorator('authCode', {
                            initialValue: _state.authCode,
                            rules: [{ required: false, message: '例:AUTH_SUPER,AUTH_SUPER(多个权限使用","分割)!' }]
                        })(
                            <Input placeholder='例:AUTH_SUPER,AUTH_SUPER(多个权限使用","分割)!' />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="编码"
                    >
                        {getFieldDecorator('hash_code', {
                            initialValue: _state.hash_code,
                            rules: [{ required: false, message: '请输入编码!' }]
                        })(
                            <Input placeholder="请输入编码" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="描述"
                    >
                        {getFieldDecorator('description', {
                            initialValue: _state.description,
                            rules: [{ required: false, message: '请输入描述!' }]
                        })(
                            <Input placeholder="请输入描述（选填）" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="模块"
                    >
                        {getFieldDecorator('module', {
                            initialValue: _state.module,
                            rules: [{ required: true, message: '从模块接口获取!' }]
                        })(
                            <Select>
                                {this.props._platformData.length > 0 ? this.props._platformData.map(function (item,index){
                                    return <Option value={item.code} key={index}>{item.name}</Option>
                                })
                                    :
                                    null
                                }
                            </Select>
                            // <Input placeholder="请输入模块（选填）" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否内部调用"
                    >
                        {getFieldDecorator('innerInvoke', {
                            initialValue: JSON.stringify(_state.innerInvoke),
                            rules: [{ required: true, message: '请输入选择!' }]
                        })(
                            <Select >
                                <Option value="1">是</Option>
                                <Option value="0">否</Option>
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

EditModal = Form.create()(EditModal)
export default EditModal