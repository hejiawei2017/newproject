import React, {Component} from 'react'
import {serviceItemManage} from '../../../services'
import {Input, Form,Modal,message,Button,Select} from 'antd'
import {connect} from "react-redux"
import Global from "../../../utils/Global"
const FormItem = Form.Item
const Option = Select.Option

const mapStateToProps = (state, action) => {
    return {
        addCommentM: state.addCommentM,
        updateCommentM: state.updateCommentM
    }
}

class ServiceItemAddForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            servicecode:'',
            servicename:'',
            templatetypeid:'',
            currValue:'',
            error:'',
            errorP:'',
            status:'',
            setTemid : this.props.dataType && this.props.data.templatetypeid === 1 ? '1' : this.props.dataType && this.props.data.templatetypeid === 0 ? '0' : '请选择服务项模板'
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (value){
        this.setState({
            setTemid:value
        })
    }

    //提交数据
    handleOk = (e) =>{
        e.preventDefault()
        this.setState({
            error:'',
            errorP:''
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }
            if(values.templatetypeid === '请选择服务项模板') {
                this.setState({
                    error:'error',
                    errorP:'服务项模板不能为空'
                })
                return
            }
            const params = {
                creator:Global.userInfo.nickName,
                servicename: values.servicename,
                templatetypeid:values.templatetypeid
            }
            if(this.props.dataType === false){
                this.formAdd(params)
            }else{
                this.formUpdate(params)
            }
        })

    }

    // 新增数据
    formAdd (obj){
        this.props.dispatch({
            type: 'ADD_SERVICE_ITEM_ING'
        })
        serviceItemManage.addServiceItem(obj).then((data) => {
            this.props.dispatch({
                type: 'ADD_SERVICE_ITEM_SUCCESS'
            })
            message.success('新增成功！')
            this.setState({
                disable:true
            })
            this.props.onCancel()
        }).catch((data) => {
            message.success('新增失败',0.5)
        })
    }

    // 更新原本数据
    formUpdate (obj){
        const params = obj
        params.id = this.props.data.id
        params.version = this.props.data.version
        params.timeVersion = new Date().getTime()
        params.createTime = new Date(this.props.data.createTime) / 1
        this.props.dispatch({
            type: 'UPDATE_SERVICE_ITEM_ING'
        })
        serviceItemManage.updateServiceItem(params).then((data) => {
            this.props.dispatch({
                type: 'UPDATE_SERVICE_ITEM_SUCCESS'
            })
            message.success('更新成功！')
            this.props.onCancel()
        })
    }

    render () {
        const {visible, onCancel, form} = this.props
        const { getFieldDecorator } = form
        let _formData = this.props.data
        console.log(_formData)
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span:18 }
            }
        }
        const data = [{
            label:'服务商编号',
            codetag:'servicecode',
            placeholder:'请输入服务商编号',
            value:this.props.dataType ? _formData.servicecode : '',
            message:'服务商编号不能为空',
            relus:false,
            max:150
        },{
            label:'服务项名称',
            codetag:'servicename',
            placeholder:'请输入服务项名称',
            value:this.props.dataType ? _formData.servicename : '',
            message:'服务项名称不能为空',
            relus:true,
            max:150
        }]

        return (
            <Modal
                visible={visible}
                title="添加服务项"
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                footer={[
                    <span key="cancel" className="click-link mr-md" onClick={onCancel}>关闭</span>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                        确定
                    </Button>
                ]}
            >
                <Form>
                    {data.length > 0 ? data.map(function (item,index) {
                        return (
                            <FormItem label={item.label} key={index} {...formItemLayout}>
                                {getFieldDecorator(item.codetag,
                                    {initialValue:item.value, rules: [{ required:item.relus, message:item.message }]},
                                )(
                                    item.codetag === "servicecode" ? <div className={item.value ? 'ant-input ant-input-disabled' : ''}>
                                        {item.value}
                                    </div> : <Input maxLength={item.max} type="text" disabled={item.disable} placeholder={item.placeholder} />
                                )}
                            </FormItem>
                        )}) : null
                    }
                    <FormItem label={"服务项模板"} validateStatus={this.state.error} help={this.state.errorP} {...formItemLayout}>
                        {getFieldDecorator("templatetypeid", {initialValue:this.state.setTemid, rules: [{ required:true, message:'ewew' }]},
                        )(
                            <Select placeholder="请选择服务项模板" onChange={this.handleChange}>
                                <Option value="0">普通服务模版</Option>
                                <Option value="1">行李托运服务专用模版</Option>
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

let ServiceItemAdd = Form.create()(ServiceItemAddForm)
export default connect(mapStateToProps)(ServiceItemAdd)