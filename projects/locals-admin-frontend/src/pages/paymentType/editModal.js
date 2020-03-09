import React, { Component } from 'react'
import { Modal, Input, Form, InputNumber, Select} from 'antd'
import { calculateMap } from '../../utils/dictionary'
const FormItem = Form.Item
const Option = Select.Option
const calculateOption = []
for (const key in calculateMap) {
    if (calculateMap.hasOwnProperty(key)) {
        calculateOption.push(<Option key={key}>{calculateMap[key]}</Option>)
    }
}
class EditModal extends Component {
    constructor () {
        super()
        this.state = {
            id: '',
            name: '',
            calculate: null,
            manualTypeStr: '',
            code: null,
            remark: '',
            editModalVisible: true
        }
        this.onModalOk = this.onModalOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }
    componentDidMount () {
        // console.log('弹窗-->', this.props._data)
        this.setState({
            id: this.props._data.id,
            name: this.props._data.name,
            calculate: this.props._data.calculate,
            manualTypeStr: this.props._data.manualTypeStr,
            code: this.props._data.code,
            remark: this.props._data.remark
        })
    }
    onModalOk (e) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // const params = {...values}
                // if (this.props.editType !== 'add') {
                //     params.id = this.state.id
                // }
                // console.log('--', values)
                this.props.labelModalSave(values)
            }
        })
    }
    handleCancel () {
        this.setState({
            editModalVisible: false
        }, this.props.stateChange({
            editModalVisible: false
        }))
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
            <Modal visible={_state.editModalVisible}
                title={this.props.editType === 'add' ? '添加' : '编辑'}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
                cancelText="关闭"
                okText="保存"
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="名称"
                    >
                        {getFieldDecorator('name', {
                            initialValue: _state.name,
                            rules: [{required: true, message: '请输入名称'}]
                        })(
                            <Input placeholder="请输入名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="计算符号"
                    >
                        {getFieldDecorator('calculate', {
                            initialValue: typeof _state.calculate === "number" ? _state.calculate.toString() : _state.calculate,
                            rules: [{required: true, message: '请输入计算符号'}]
                        })(
                            <Select>
                                {calculateOption}
                            </Select>
                        )}
                        {/* <InputNumber min={-1} max={1} placeholder="请输入计算符号" /> */}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="人工干预类型"
                    >
                        {getFieldDecorator('manualTypeStr', {
                            initialValue: _state.manualTypeStr,
                            rules: [{ required: true, message: '请输入人工干预类型' }]
                        })(
                            <Select>
                                <Option value="非提现充值">非提现充值</Option>
                                <Option value="提现充值">提现充值</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="钱包款项编码"
                    >
                        {getFieldDecorator('code', {
                            initialValue: _state.code,
                            rules: [{required: true, message: '请输入钱包款项编码'}]
                        })(
                            <InputNumber placeholder="请输入钱包款项编码" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        {getFieldDecorator('remark', {
                            initialValue: _state.remark,
                            rules: [{required: true, message: '请输入备注'}]
                        })(
                            <Input placeholder="请输入备注" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

EditModal = Form.create()(EditModal)
export default EditModal