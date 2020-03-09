import React, { Component } from 'react'
import { Row, Col, Form, Button, Icon,Select,InputNumber,Popconfirm,Input, message, TreeSelect} from 'antd'
import {connect} from "react-redux"
import Global from "../../../utils/Global"
import {serviceItemManage} from "../../../services"
import {consumeList} from "../../../utils/dictionary"
const { TextArea } = Input
const FormItem = Form.Item
const Option = Select.Option
const SHOW_PARENT = TreeSelect.SHOW_PARENT

const mapStateToProps = (state, action) => {
    return {
        delTemplateM: state.delTemplateM
    }
}
class DefaultTemplate extends Component {
    constructor (props) {
        super(props)
        this.state = {
            disabled:this.props.disable,
            privideName:'',
            contractType:this.props.data.templatecol1 || '1501',
            value:undefined
        }
        this.deleteItem = this.deleteItem.bind(this)
        this.handleContractType = this.handleContractType.bind(this)
    }

    handleContractType = (k,value) =>{
        this.setState({
            contractType:value
        })
    }
    deleteItem (k) {
        this.props.dispatch({
            type: 'DEL_TEMPLATE_ING'
        })
        serviceItemManage.delTemplate(this.props.data.id).then((data) => {
            this.props.dispatch({
                type: 'DEL_TEMPLATE_SUCCESS'
            })
            message.success('删除成功',0.5)
            this.props.onUpdate()
        }).catch( e =>{
            message.success('删除失败',0.5)
        })
    }

    wringItem (k){
        this.props.providerList.map((item) => {
            if(item.id === this.props.data.providerid){
                this.setState({
                    privideName:item.providername
                })
            }
            return this.state.privideName
        })
    }

    editItem (k){
        this.setState({
            disabled:false
        })
    }

    //提交数据
    okItem = (k) =>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }
            const areaArr = []
            values.areaList.map((item) => {
                areaArr.push({
                    areacode: item + ""
                })
                return areaArr
            })
            const params = {
                id:this.props.data.id,
                areas:areaArr,
                providerid:values.providerid,
                templatecol1: values.templatecol1,
                templatecol2: values.templatecol2 - 0,
                templatecol3: values.templatecol3,
                templatecol4: values.templatecol4 - 0 || 0,
                templatecol5: values.templatecol5 || '',
                updator:Global.userInfo.nickName,
                version:this.props.data.version
            }
            this.props.dispatch({
                type: 'UPDATE_TEMPLATE_ING'
            })
            if(this.props.disable === false){
                // params.id = this.props.data.id
                params.version = 1
                params.status = 1
                params.serviceid = this.props.id
                params.creator = Global.userInfo.nickName
                params.areaList = values.areaList
                params.templatecol6 = ''
                params.templatecol7 = ''
                params.templatecol8 = ''
                params.templatecol9 = ''
                params.templatecol10 = ''
                params.templatecol11 = ''
                params.templatecol12 = ''
                params.templatecol13 = ''
                params.templatecol14 = ''
                params.templatecol15 = ''
                params.templatecol16 = ''
                params.templatecol17 = ''
                params.templatecol18 = ''
                params.templatecol19 = ''
                params.templatecol20 = ''
                params.timeVersion = new Date().getTime()
                params.createTime = new Date().getTime()
            }
            if(this.props.disable === false){
                this.formAdd(params)
            }else {
                this.formUpdate(params)
            }
        })

    }


    formAdd (obj){
        serviceItemManage.submitTemplate(obj).then((data) => {
            this.props.dispatch({
                type: 'SUBMIT_TEMPLATE_SUCCESS'
            })
            message.success('操作成功',0.5)
            // this.props.onUpdate()
        }).catch( e =>{
            message.success('操作失败',0.5)
        })
    }
    formUpdate (obj){
        serviceItemManage.updateTemplate(obj).then((data) => {
            this.props.dispatch({
                type: 'UPDATE_TEMPLATE_SUCCESS'
            })
            message.success('更新成功',0.5)
            // this.props.onUpdate()
        }).catch( e =>{
            message.success('更新失败',0.5)
        })
    }


    render () {
        const _this = this
        const {providerList,data,k,areaList,templatetypeid,orgType} = _this.props
        const { getFieldDecorator } = _this.props.form
        const {contractType,disabled} = _this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span:19 }
            }
        }

        const _formData = data
        const treeData = areaList || []

        const tProps = {
            treeData,
            treeCheckable: true,
            treeNodeFilterProp:"label",
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: "请选择服务地区",
            treeDataSimpleMode: templatetypeid === 1 ? null : {
                id: "code",
                pId: "parentCode",
                rootPId:0
            },
            style: {
                width: "100%"
            }
        }
        return (
            <form key={k} className="ant-template">
                <FormItem {...formItemLayout} label="服务商名称">
                    {getFieldDecorator('providerid', {initialValue:_formData.providerid || undefined,rules: [{ required:true, message:'服务品不能为空' }]},
                    )(
                        <Select
                            disabled={disabled}
                            placeholder="请选择服务商"
                            style={{width:"100%"}}
                        >
                            {
                                providerList.length > 0 ? providerList.map(function (item,index) {
                                    return <Option key={item.id} value={item.id} > {item.providername} </Option>
                                }) : null
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem label="服务地区" {...formItemLayout} >
                    {getFieldDecorator('areaList', {initialValue:_formData.areaList || "请选择服务地区",rules: [{type: 'array',required:true, message:'服务地区不能为空' }]},
                    )(
                        <TreeSelect
                            disabled={disabled}
                            {...tProps}
                        />
                    )}
                </FormItem>
                <Row type="flex" className="mb" justify="space-between" align="top">
                    <Col xs={5} className="text-right">
                        <label htmlFor="templatecol1" className="ant-form-item-required" title="签约价(￥)">签约价(￥)：</label>
                    </Col>
                    <Col xs={19}>
                        <Row type="flex" justify="space-between" align="top">
                            <Col xs={13}>
                                <FormItem style={{marginBottom:0}}>
                                    {getFieldDecorator("templatecol1", {initialValue:_formData.templatecol1 || contractType, rules: [{ required:true, message:'签约价不能为空' }]},
                                    )(
                                        <Select
                                            disabled={disabled}
                                            placeholder="请选择签约价的模式"
                                            onChange={function (value) {_this.handleContractType(k, value)}}
                                            style={{width:"100%"}}
                                        >
                                            {
                                                consumeList.map(function (item) {
                                                    return <Option key={item.value} value={item.value}>{item.label}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={6}>
                                <FormItem style={{marginBottom:0}}>
                                    {getFieldDecorator("templatecol2",
                                        {
                                            initialValue:_formData.templatecol2,
                                            rules: [{ required:true, message:'签约价格不能为空' }]
                                        },
                                    )(
                                        <InputNumber
                                            placeholder="请输入签约的价格"
                                            disabled={disabled}
                                            min={1}
                                            max={10000}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={4} style={{marginTop:9}} className="text-right">
                                {
                                    contractType === "1501" ? "元/ 每件" : null
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} label="服务项内容说明">
                    {getFieldDecorator('templatecol3',
                        {
                            initialValue:_formData.templatecol3,
                            rules: [{ required:true, message:'服务项内容说明不能为空' }]
                        },
                    )(
                        <TextArea
                            disabled={disabled}
                            maxLength={2000}
                            placeholder="请输入服务项内容说明"
                            autosize={{ minRows: 2, maxRows:4 }}
                        />
                    )}
                </FormItem>
                {templatetypeid === 1 ?
                    <div>
                        <FormItem label="保价费率（%）" {...formItemLayout} >
                            {getFieldDecorator('templatecol4',
                                {
                                    initialValue:_formData.templatecol4 || 0,
                                    rules: [{ required:true, message:'保价费率不能为空' }]
                                },
                            )(
                                <InputNumber
                                    disabled={disabled}
                                    min={1}
                                    max={10}
                                />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label="保价说明">
                            {getFieldDecorator('templatecol5',
                                {
                                    initialValue:_formData.templatecol5,
                                    rules: [{ required:true, message:'保价说明不能为空' }]
                                },
                            )(
                                <TextArea
                                    maxLength={2000}
                                    disabled={disabled}
                                    placeholder="请填写保价说明"
                                    autosize={{ minRows: 2, maxRows:4 }}
                                />
                            )}
                        </FormItem>
                    </div> : null
                }
                {
                    orgType === "service" ?
                        <div className="text-right">
                            {
                                disabled ?
                                    <Button
                                        type="dashed"
                                        name="stop"
                                        className="ant-btn-dashed-green mr-sm"
                                        style={{ width:"120px"}}
                                        onClick={function () {_this.editItem(k)}}
                                    >
                                        编辑
                                    </Button> :
                                    <Button
                                        type="dashed"
                                        name="stop"
                                        className="ant-btn-dashed-green mr-sm"
                                        style={{ width:"120px"}}
                                        onClick={function () {_this.okItem(k)}}
                                    >
                                        提交
                                    </Button>

                            }
                            {
                                this.props.disable === true ?
                                    <Popconfirm
                                        placement="left"
                                        title={'请确认是否需要删除服务商: ' + this.state.privideName}
                                        onConfirm={function () {_this.deleteItem(k)}}
                                        okText="删除"
                                        cancelText="取消"
                                    >
                                        <Button
                                            type="dashed"
                                            onClick={function () {_this.wringItem(k)}}
                                            className="ant-btn-dashed-danger"
                                            style={{ width:"120px"}}
                                        >
                                            <Icon type="minus-circle-o" />
                                            删除服务商
                                        </Button>
                                    </Popconfirm> : null
                            }

                        </div> : null
                }

            </form>
        )
    }
}

let DefaultTemplateNew = Form.create()(DefaultTemplate)
export default connect(mapStateToProps)(DefaultTemplateNew)
