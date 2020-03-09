import React, { Component } from 'react'
import { Row, Col, Form, Button,Input, Icon,Select,InputNumber,TreeSelect,message} from 'antd'
import {consumeList} from "../../../utils/dictionary"
import {serviceItemManage} from "../../../services"
import {connect} from "react-redux"
import Global from "../../../utils/Global"
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
const SHOW_PARENT = TreeSelect.SHOW_PARENT

const mapStateToProps = (state, action) => {
    return {
        areaM: state.areaM
    }
}

class SetTransportTemplate extends Component {
    constructor (props) {
        super(props)
        this.state = {
            contractType:'1501',
            uuid:0
        }
        this.addItem = this.addItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.handleContractType = this.handleContractType.bind(this)
        this.okItem = this.okItem.bind(this)

    }

    addItem () {
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(this.state.uuid)
        this.state.uuid++
        form.setFieldsValue({
            keys: nextKeys
        })
    }

    handleContractType = (k,value) =>{
        this.setState({
            contractType:value
        })
    }

    deleteItem (k) {
        const {form } = this.props
        const keys = form.getFieldValue('keys')
        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        })
    }

    //提交数据
    okItem = (k) =>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }
            const areaArr = []
            values[`temp-areas-${k}`].map((item) => {
                areaArr.push({
                    areacode: item
                })
                return areaArr
            })

            const params = {
                serviceid:this.props.id,
                areas:areaArr,
                areaList: values[`temp-areas-${k}`],
                providerid:values[`temp-providerid-${k}`],
                templatecol1: values[`temp-templatecol1-${k}`] || '',
                templatecol2: values[`temp-templatecol2-${k}`] || '',
                templatecol3: values[`temp-templatecol3-${k}`] || '',
                templatecol4: values[`temp-templatecol4-${k}`] || '',
                templatecol5: values[`temp-templatecol5-${k}`] || '',
                creator:Global.userInfo.nickName,
                updator:Global.userInfo.nickName,
                createTime:new Date().getTime(),
                timeVersion:new Date().getTime(),
                templatecol6:'',
                templatecol7:'',
                templatecol8:'',
                templatecol9:'',
                templatecol10:'',
                templatecol11:'',
                templatecol12:'',
                templatecol13:'',
                templatecol14:'',
                templatecol15:'',
                templatecol16:'',
                templatecol17:'',
                templatecol18:'',
                templatecol19:'',
                templatecol20:'',
                version:1
            }
            this.props.dispatch({
                type: 'SUBMIT_TEMPLATE_ING'
            })
            serviceItemManage.submitTemplate(params).then((data) => {
                this.props.dispatch({
                    type: 'SUBMIT_TEMPLATE_SUCCESS'
                })
                message.success('提交成功',0.5)
                this.props.onUpdate()
            }).catch( e =>{
                message.success('提交失败',0.5)
            })
        })

    }

    render () {
        const _this = this
        const {providerList,form,areaList,orgType,templatetypeid} = _this.props
        const { getFieldDecorator, getFieldValue } = form
        const {contractType} = this.state
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

        getFieldDecorator('keys', {initialValue: []})

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
        const keys = getFieldValue('keys')
        const formItems = keys.map((k, index) => {
            return (
                <form className="ant-template" key={k} onSubmit={function (){_this.okItem(k)}}>
                    <FormItem label="服务商名称" {...formItemLayout}>
                        {getFieldDecorator(`temp-providerid-${k}`, { rules: [{ required:true, message:'服务商不能为空'}]},
                        )(
                            <Select placeholder="请选择服务商名称" onChange={this.handleChange}>
                                {
                                    providerList.length > 0 ? providerList.map(function (item,index) {
                                        return <Option key={item.id} value={item.id} > {item.providername} </Option>
                                    }) : null
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="服务地区" {...formItemLayout} >
                        {getFieldDecorator(`temp-areas-${k}`, {rules: [{type: 'array',required:true, message:'服务地区不能为空' }]},
                        )(
                            <TreeSelect {...tProps} />
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
                                        {getFieldDecorator(`temp-templatecol1-${k}`, {initialValue:'1501', rules: [{ required:true, message:'ewew' }]},
                                        )(
                                            <Select placeholder="请选择签约价模式" onChange={function (value) {_this.handleContractType(k, value)}}>
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
                                        {getFieldDecorator(`temp-templatecol2-${k}`, {rules: [{ required:true, message:'签约价格不能为空' }]},
                                        )(
                                            <InputNumber min={1} max={10000} placeholder="请输入签约价格" />
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
                    <FormItem label="服务项内容说明" {...formItemLayout}>
                        {getFieldDecorator(`temp-templatecol3-${k}`,
                            {rules: [{ required:true, message:'服务项内容说明不能为空'}]},
                        )(
                            <TextArea
                                maxLength={2000}
                                placeholder="请输入服务项内容说明"
                                autosize={{ minRows: 2, maxRows: 6 }}
                            />
                        )}
                    </FormItem>

                    <FormItem label="保价费率（%）" {...formItemLayout}>
                        {getFieldDecorator(`temp-templatecol4-${k}`, {initialValue:1, rules: [{ required:true, message:'保价费率不能为空' }]},
                        )(
                            <InputNumber min={1} max={1000} />
                        )}
                    </FormItem>

                    <FormItem label="保价说明" {...formItemLayout} >
                        {getFieldDecorator(`temp-templatecol5-${k}`, { rules: [{ required:true, message:'保价说明不能为空' }]},
                        )(
                            <TextArea maxLength={2000} placeholder="请填写保价说明" autosize={{ minRows: 2, maxRows:4 }} />
                        )}
                    </FormItem>
                    {
                        orgType === "service" ?
                            <div className="text-right">
                                <Button
                                    type="dashed"
                                    name="stop"
                                    className="ant-btn-dashed-green mr-sm"
                                    style={{ width:"120px"}}
                                    onClick={function () {_this.okItem(k)}}
                                >
                                    提交
                                </Button>
                                <Button
                                    type="dashed"
                                    onClick={function () {_this.deleteItem(k)}}
                                    className="ant-btn-dashed-danger"
                                    style={{ width:"120px"}}
                                >
                                    <Icon type="minus-circle-o" /> 取消添加
                                </Button>
                            </div> : null
                    }

                </form>
            )
        })
        return (
            <div>
                {formItems}
                {
                    orgType === "service" ?
                        <Row>
                            <Col xs={24} className="text-center">
                                <Button
                                    type="dashed"
                                    onClick={this.addItem}
                                    className="ant-btn-dashed-primary"
                                    style={{ width:"220px"}}
                                >
                                    <Icon type="plus-circle-o" /> 添加服务商
                                </Button>
                            </Col>
                        </Row> : null
                }

            </div>
        )
    }
}


let SetTransportTemplateNew = Form.create()(SetTransportTemplate)
export default connect(mapStateToProps)(SetTransportTemplateNew)
