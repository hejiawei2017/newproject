import React, { Component } from 'react'
import { Input, InputNumber, Modal, Form, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option;
var FormItemOption

class EditLabelModalForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            editModalVisible: true,
            confirmLoading: false,
            formItems: []
        }
    }
    componentDidMount (){
        this.setState({
            id:this.props._data.id,
            name:this.props._data.name,
            orderNumber:this.props._data.orderNumber,
            description:this.props._data.description
        })
        this.getFormItem()
    }
    handleCancel = () => {
        this.setState({
            editModalVisible: false
        })
    }
    onModalOk = (e) => {
        e && e.preventDefault()
        console.log('onModalOk',this.props.form.getFieldsValue())
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.handleCancel()
                if(this.props.editType === 'add'){
                    this.props.modalAddSave(values)
                }else{
                    this.props.modalEditSave(values)
                }
            }
        })
    }
    afterClose = ()=>{
        this.props.stateChange({editModalVisible: false})
    }
    getFormItem = async () => {
        let formItems = []
        for (const key in this.props._data) {
            const item = this.props._data[key]
            if(item.noVisible){
                formItems.push({
                    noVisible: item.noVisible,
                    key,
                    defaultValue: item.defaultValue
                })
                break
            }
            switch (item.element) {
            case 'multipleSelect':
                await item.loadData().then((res)=>{
                    formItems.push({
                        key,
                        defaultValue: item.defaultValue,
                        element: item.element,
                        loadData: res,
                        label: item.label,
                        placeholder: item.placeholder,
                        rules: {
                            required: item.rules && item.rules.required,
                            message: `请输入${item.placeholder}`,
                            type: 'array'
                        }
                    })
                })
                break
            default:
                formItems.push({
                    key,
                    label: item.label,
                    defaultValue: item.defaultValue,
                    element: item.element,
                    placeholder: item.placeholder,
                    rules: {
                        required: item.rules && item.rules.required,
                        message: `请输入${item.placeholder}`
                    }
                })
                break
            }
        }
        this.setState({
            formItems
        })
    }
    renderFormItem = () => {
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
        let formItems = this.state.formItems
        let formItemList = []
        formItems.map((item, index) => {
            let FormItemDom
            let key = item.key
            if(item.noVisible){
                formItemList.push((
                    <FormItem key={key} style={{display: 'none'}}>
                        {getFieldDecorator(key, {
                            initialValue: item.defaultValue
                        })(
                            <Input />
                        )}
                    </FormItem>))
                return item
            }
            switch (item.element) {
                case 'number':
                    FormItemDom = <InputNumber placeholder={item.placeholder || '请输入'} />
                    break
                case 'textarea':
                    FormItemDom = <Input.TextArea rows={3} placeholder={item.placeholder || '请输入'} />
                    break
                    case 'multipleSelect':
                        const children = [];
                        item.loadData.map((i)=>{
                            children.push(<Option key={i.roleCode}>{i.roleName}</Option>);
                            return i;
                        })
                        FormItemDom = (
                            <Select
                                mode="multiple"
                                placeholder="请选择"
                            >
                                {children}
                            </Select>
                        )
                    break
                default:
                    FormItemDom = <Input placeholder={item.placeholder || '请输入'} />
                    break
                }
                formItemLayout.key = key
                formItemList.push((
                    <FormItem
                        {...formItemLayout}
                        label={item.label}
                    >
                        {getFieldDecorator(key, {
                            initialValue: item.defaultValue,
                            rules: [item.rules]
                        })(
                            FormItemDom
                        )}
                    </FormItem>
                ))
                return item
            })
        console.log('formItems123', formItemList)
        return formItemList
    }
    render () {
        const _state = this.state
        const {confirmLoading, formItems} = _state
        console.log('_state', _state, this.props)
        return (
            <Modal
                visible={_state.editModalVisible}
                title={_state.editType === "add" ? '新增标签' : '编辑标签'}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
                confirmLoading={confirmLoading}
                cancelText="关闭"
                okText="保存"
                afterClose={this.afterClose}
            >
                <Form>
                    {this.renderFormItem()}
                </Form>
            </Modal>
        )
    }
}

let EditLabelModal = Form.create()(EditLabelModalForm)
export default EditLabelModal