import React, { PureComponent, Fragment } from 'react'
import { Form, Input, Modal, Select, Radio, message } from 'antd'
import './index.less'
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
const RadioGroup = Radio.Group;

class EditModal extends PureComponent {
    constructor () {
        super();
        this.editDepartmentButton = this.editDepartmentButton.bind(this);
        this.onOk = this.onOk.bind(this);
        this.editGrounpButton = this.editGrounpButton.bind(this);
        this.addDepartmentButton = this.addDepartmentButton.bind(this);
        this.addGroupButton = this.addGroupButton.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.resetFields = this.resetFields.bind(this);
    }

    onOk = (e) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.getParams(values)
            }
        })
    }
    editDepartmentButton = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['departmentId'], (err, values) => {
            if (!err) {
                if (values.departmentId === '请选择') {
                    message.warn('请选择一个推广部门')
                } else {
                    this.props.editDepartmentButton(values)
                }
            }
        })
    }
    editGrounpButton = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['groupId'], (err, values) => {
            if (!err) {
                if (values.groupId === '请选择') {
                    message.warn('请选择一个推广分组')
                } else {
                    this.props.editGrounpButton(values)
                }
            }
        })
    }
    addDepartmentButton = () =>{
        this.props.addDepartmentButton();
    }
    addGroupButton = () =>{
        this.props.addGroupButton();
    }
    handleCancel = () =>{
        this.props.handleCancel()
    }
    resetFields = () =>{
        this.props.form.resetFields()
    }
    render () {
        const { title, visible, deapartmentList,editContent, groupList,editNewDartpment,addNewDartpment,editNewGrounp,addNewGrounp } = this.props;
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
                title={title}
                visible={visible}
                onOk={this.onOk}
                onCancel={ this.handleCancel }
                afterClose={this.resetFields}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="推广部门"
                    >
                        <Fragment>
                            {getFieldDecorator('departmentId', {
                                initialValue:addNewDartpment !== null ? addNewDartpment : editNewDartpment !== null ? editNewDartpment : editContent ? editContent.departmentName : '请选择',
                                rules: [{ required: true, message: '请选择推广部门' }]
                            })(
                                <Select style={{ width: 160 }}>
                                    {deapartmentList.map((item, index) => {
                                        return <Option value={item.id} key={index.toString()}>{item.departmentName}</Option>
                                    })}
                                </Select>
                            )}
                            <span className="channel-button"
                                onClick={this.addDepartmentButton}
                            >新增</span>
                            <span className="channel-button"
                                onClick={this.editDepartmentButton}
                            >编辑</span>
                        </Fragment>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="推广分组"
                    >
                        <Fragment>
                            {getFieldDecorator('groupId', {
                                initialValue:addNewGrounp !== null ? addNewGrounp : editNewGrounp !== null ? editNewGrounp : editContent ? editContent.groupName : '请选择',
                                rules: [{ required: true, message: '请选择推广部门' }]
                            })(
                                <Select style={{ width: 160 }}>
                                    {groupList.map((item, index) => {
                                        return <Option value={item.id} key={index.toString()}>{item.groupName}</Option>
                                    })}
                                </Select>
                            )}
                            <span className="channel-button"
                                onClick={this.addGroupButton}
                            >新增</span>
                            <span className="channel-button"
                                onClick={this.editGrounpButton}
                            >编辑</span>
                        </Fragment>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="推广名称"
                    >
                        {getFieldDecorator('promotionName', {
                            initialValue: editContent ? editContent.promotionName : '',
                            rules: [{ required: true, message: '请输入推广名称' }]
                        })(
                            <Input placeholder="请输入推广名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="推广描述"
                    >
                        {getFieldDecorator('promotionDes', {
                            initialValue: editContent ? editContent.promotionDes : ''
                        })(
                            <TextArea rows={4} placeholder="详细说明推广的场景以便后续的跟踪" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="推广描述"
                    >
                        {getFieldDecorator('peomotionDesState', {
                            initialValue: editContent ? editContent.peomotionDesState : 0,
                            rules: [{ required: true, message: '请选择推广状态' }]
                        })(
                            <RadioGroup>
                                <Radio value={0}>无效</Radio>
                                <Radio value={1}>有效</Radio>
                                <Radio value={2}>停用</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }

}
EditModal = Form.create()(EditModal)
export default EditModal;