import React, {Component} from 'react'
import {serviceProviderList} from '../../../services'
import {Input, Form,Modal,message,Button,Row, Col} from 'antd'
import {connect} from "react-redux"
import Global from '../../../utils/Global.js'
import {reg} from "../../../utils/utils"
const FormItem = Form.Item

const mapStateToProps = (state, action) => {
    return {
        addProviderM: state.addProviderM,
        updateProviderM: state.updateProviderM
    }
}

class ProviderEditForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            formData:[],
            providercode:'',
            providername:'',
            providerbrandname:'',
            hotlinephone:'',
            remark:'',
            disable:true,
            editType:false,
            editFont:'编辑',
            visible: this.props.visible
        }
    }

    //提交数据
    handleEdit = (e) =>{
        if(this.props.dataType){
            if(this.state.disable){
                this.setState({
                    disable:false,
                    editFont:'确认'
                })
            }else{
                e.preventDefault()
                this.props.form.validateFieldsAndScroll((err, values) => {
                    if (err) {
                        return
                    }
                    this.formUpdate(values)
                })
            }
        }else{
            e.preventDefault()
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    return
                }
                this.formAdd(values)
            })
        }
    }

    // 新增数据
    formAdd (obj){
        const params = {
            creator:Global.userInfo.nickName,
            providername: obj.providername,
            providerbrandname: obj.providerbrandname,
            hotlinephone: obj.hotlinephone,
            remark: obj.remark
        }
        this.props.dispatch({
            type: 'ADD_PROVIDER_ING'
        })
        serviceProviderList.addProvider(params).then((data) => {
            this.props.dispatch({
                type: 'ADD_PROVIDER_SUCCESS'
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
            id:this.props.id,
            version:this.props.formData.version,
            creator:Global.userInfo.nickName,
            providername: obj.providername,
            providerbrandname: obj.providerbrandname,
            hotlinephone: obj.hotlinephone,
            remark: obj.remark
        }
        this.props.dispatch({
            type: 'UPDATE_PROVIDER_ING'
        })
        serviceProviderList.updateProvider(params).then((data) => {
            this.props.dispatch({
                type: 'UPDATE_PROVIDER_SUCCESS'
            })
            message.success('更新成功！')
            this.setState({
                disable:true
            })
            this.props.onCancel()
        })
    }

    // 关联服务项
    handleLink = () =>{
        this.props.onNext()
    }
    render () {
        const {visible, onCancel, form} = this.props
        const { getFieldDecorator } = form
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
        let formData = this.props.formData
        let disable = this.props.dataType ? this.state.disable : false

        const data = [{
            label:'服务商编号',
            codetag:'providercode',
            placeholder:'请输入服务商编号',
            value:this.props.dataType ? formData.providercode : '',
            message:'服务商编号不能为空',
            relus:false
        },{
            label:'服务商品牌名称',
            codetag:'providerbrandname',
            placeholder:'请输入服务商品牌名称',
            value:this.props.dataType ? formData.providerbrandname : '',
            message:'服务商品牌名称不能为空',
            relus:true,
            disable:disable,
            max:50
        },{
            label:'服务商公司名称',
            codetag:'providername',
            placeholder:'请输入服务商名称',
            value:this.props.dataType ? formData.providername : '',
            message:'服务商名称不能为空',
            relus:true,
            disable:disable,
            max:50
        },{
            label:'客服电话',
            codetag:'hotlinephone',
            placeholder:'请输入客服电话',
            value:this.props.dataType ? formData.hotlinephone : '',
            message:'客服电话不能为空',
            relus:true,
            disable:disable,
            max:15
        },{
            label:'服务商备注',
            codetag:'remark',
            placeholder:'请输入服务商备注',
            value:this.props.dataType ? formData.remark : '',
            message:'服务商备注不能为空',
            relus:false,
            disable:disable,
            max:200
        }]

        return (
            <Modal
                visible={visible}
                title= {this.props.dataType ? '服务商详情' : '新增'}
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                footer={[
                    <Row key="row">
                        <Col xs={12} key="col1" className="text-left">
                            {
                                this.props.dataType ? <Button key="linkBtn" type="primary" onClick={this.handleLink}>
                                    关联服务项
                                </Button> : null
                            }
                        </Col>
                        <Col key="col2" xs={12}>
                            <span key="cancel" className="click-link mr-md" onClick={onCancel}>关闭</span>
                            <Button key="submit" type="primary" onClick={this.handleEdit}>
                                {
                                    this.props.dataType ? this.state.editFont : '确认'
                                }
                            </Button>
                        </Col>
                    </Row>
                ]}
            >
                <Form>
                    {data.length > 0 ? data.map(function (item,index) {
                        return (
                            <div key={index}>
                                {
                                    item.codetag === "hotlinephone" ?
                                        <FormItem label={item.label} {...formItemLayout}>
                                            {getFieldDecorator(item.codetag,
                                                {initialValue:item.value, rules: [
                                                    { required:item.relus, message:item.message },
                                                    {
                                                        pattern:reg.tel,message: '请输入正确手机号码!'
                                                    }
                                                ]},
                                            )(
                                                <Input type="text" maxLength={item.max} disabled={item.disable} placeholder={item.placeholder} />
                                            )}
                                        </FormItem> :
                                        <FormItem label={item.label} {...formItemLayout}>
                                            {getFieldDecorator(item.codetag,
                                                {initialValue:item.value, rules: [{ required:item.relus, message:item.message }]},
                                            )(
                                                item.codetag === 'providercode' ? <div className={item.value ? 'ant-input ant-input-disabled' : ''}>
                                                    {item.value}
                                                </div> : <Input type="text" maxLength={item.max} disabled={item.disable} placeholder={item.placeholder} />

                                            )}
                                        </FormItem>

                                }

                            </div>
                        )}) : null
                    }
                </Form>
            </Modal>
        )
    }
}

let ProviderEdit = Form.create()(ProviderEditForm)
export default connect(mapStateToProps)(ProviderEdit)