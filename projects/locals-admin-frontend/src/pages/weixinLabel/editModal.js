import React, { Component } from 'react'
import { Input, Modal, Form } from 'antd'
import {weixinLabelService} from '../../services'
import {message} from "antd/lib/index";
import {connect} from "react-redux";

const FormItem = Form.Item

const mapStateToProps = (state, action) => {
    return {
        addUserTagM: state.addUserTagM,
        updateUserTagM: state.updateUserTagM
    }
}

class EditLabelModalForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            orderNumber: 1,
            description: '',
            editModalVisible: true
        }
        this.handleOk = this.handleOk.bind(this)
    }

    //提交数据
    handleOk = (e) =>{
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }
            if(this.props.dataType === false){
                this.formAdd(values)
            }else{
                this.formUpdate(values)
            }
        })

    }

    // 新增数据
    formAdd (obj){
        const params = {
            type:2,
            name:obj.name
        }
        this.props.dispatch({
            type: 'ADD_LABEL_ING'
        })
        weixinLabelService.addUserTag(params).then((data) => {
            this.props.dispatch({
                type: 'ADD_LABEL_ING'
            })
            message.success('新增成功！')
            this.setState({
                disable:true
            })
            this.props.onCancel()
        })
    }

    // 更新原本数据
    formUpdate (obj){
        const params = {
            id:this.props.data.id,
            tagId:this.props.data.tagId,
            type:3,
            name:obj.name
        }
        this.props.dispatch({
            type: 'UPDATE_LABEL_ING'
        })
        weixinLabelService.updateUserTag(params).then((data) => {
            this.props.dispatch({
                type: 'UPDATE_LABEL_SUCCESS'
            })
            message.success('更新成功！')
            this.setState({
                disable:true
            })
            this.props.onCancel()
        })
    }

    render () {
        const {visible, onCancel, form} = this.props
        const { getFieldDecorator } = form
        let name = this.props.dataType ? this.props.data.name : null
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
                visible={visible}
                title={this.props.dataType ? '编辑标签' : '新增标签'}
                onOk={this.handleOk}
                onCancel={onCancel}
                cancelText="关闭"
                okText="保存"
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="标签名称"
                    >
                        {getFieldDecorator('name', {
                            initialValue:name,
                            rules: [{ required: true, message: '请输入标签名称!' }]
                        })(
                            <Input placeholder="请输入标签名称" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

let EditLabelModal = Form.create()(EditLabelModalForm)
export default connect(mapStateToProps)(EditLabelModal)