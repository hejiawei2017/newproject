import React, {Component} from 'react';
import { Row, Col, Button, Form, Input,Radio,Select,Checkbox,DatePicker } from 'antd';
import UploadImage from '../../components/uploadImage';
import HandleLeaseModal from './handleLeaseModal';
import HandleRentReduceModal from './handleRentReduceModal';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const tableConfig = {
    payWay:{
        apiKey:'payWay',
        values:[
            {
                apiValue:'1',
                value:'1',
                text:'月付',
                isDefault:true
            },{
                apiValue:'2',
                value:'2',
                text:'双月付'
            },{
                apiValue:'3',
                value:'3',
                text:'季度付'
            },{
                apiValue:'4',
                value:'4',
                text:'半年付'
            },{
                apiValue:'5',
                value:'5',
                text:'年付'
            }
        ],
        rules:{required: true, message: '请输入付款方式'},
        placeholder:'',
        label:'付款方式：'
    },
    housingDeposit:{
        apiKey: 'housingDeposit',
        values:[
            {
                apiValue:'1',
                value:'1',
                text:'无需押金'
            },{
                apiValue:'2',
                value:'2',
                text:'一个月押金',
                isDefault:true
            },{
                apiValue:'3',
                value:'3',
                text:'两个月押金'
            },{
                apiValue:'4',
                value:'4',
                text:'三个月押金'
            }
        ],
        rules:{required: true, message: '请输入房屋押金'},
        placeholder:'',
        label:'房屋押金：'
    },
    serviceCharge:{
        apiKey: 'serviceCharge',
        values:[
            {
                apiValue:'1',
                value:'1',
                text:'一次性',
                isDefault:true,
                addOn:'元'
            },{
                apiValue:'2',
                value:'2',
                text:'周期性',
                addOn:'元/月'
            }
        ],
        rules:{required: true, message: '请输入服务费'},
        placeholder:'',
        label:'服务费：'
    },
    serviceChargeValue:{
        apiKey:'serviceChargeValue',
        rules:{required: true, message: '请填写服务费'}
    },
    tenantSource:{
        apiKey: 'tenantSource',
        values:[
            {
                apiValue:'1',
                value:'1',
                text:'贝壳租房',
                isDefault:true
            },{
                apiValue:'2',
                value:'2',
                text:'58同城'
            },{
                apiValue:'3',
                value:'3',
                text:'其他'
            },{
                apiValue:'4',
                value:'4',
                text:'路客自有渠道'
            }
        ],
        rules:{required: true, message: '请输入租客来源'},
        placeholder:'',
        label:'租客来源：'
    },
    tenantName:{
        apiKey: 'tenantName',
        rules:{required: true, message: '请输入承租人姓名'},
        placeholder:'请输入承租人姓名',
        label:'承租人姓名：'
    },
    tenantPhone:{
        apiKey: 'tenantPhone',
        rules:{required: true, message: '请输入承租人手机号'},
        placeholder:'请输入承租人手机号',
        label:'承租人手机号：'
    },
    tenantId:{
        apiKey: 'tenantId',
        rules:{required: true, message: '请输入承租人身份证'},
        placeholder:'请输入承租人身份证',
        label:'承租人身份证：'
    },
    tenantIdPic:{
        apiKey: 'tenantIdPic',
        rules:{required: true, message: '请上传证件'},
        label:'证件：',
        help:'支持上传多个照片/PDF？',
        placeholder:'上传身份证'
    },
    tenantSex:{
        apiKey: 'tenantSex',
        values:[
            {
                apiValue:'1',
                value:'1',
                text:'男',
                isDefault:true
            },{
                apiValue:'2',
                value:'2',
                text:'女'
            }
        ],
        rules:{required: true, message: '请选择承租人性别'},
        label:'承租人性别：'
    },
    contractPic:{
        apiKey: 'contractPic',
        rules:{required: true, message: '请上传合同'},
        label:'合同：',
        help:'支持上传多个照片/PDF？',
        placeholder:'上传合同'
    },
    tenancy:{
        apiKey:'tenancy',
        rules:{required: true, message: '请选择租期'},
        label:'租期起始：'
    },
    rentColDateSetting:{
        apiKey:'rentColDateSetting',
        rules:{required: true, message: '请选择收租日期'},
        label:'收租日期设定：',
        values:[{
            rules:{required: true, message: '请填写收租日期'},
            apiKey:'rentColDateSetting-sub-1',
            value:'1',
            apiValue:'1',
            addOnBefore:'每期提前',
            addOnAfter:'天收租',
            tips:''
        },{
            rules:{required: true, message: '请填写收租日期'},
            apiKey:'rentColDateSetting-sub-2',
            value:'2',
            apiValue:'2',
            addOnBefore:'每期固定',
            addOnAfter:'号收租',
            tips:'（例如每期固定1号，账期为6月12日到9月11日，非首期，则6月1日支付租金）'
        },{
            rules:{required: true, message: '请填写收租日期'},
            apiKey:'rentColDateSetting-sub-3',
            value:'3',
            apiValue:'3',
            addOnBefore:'每期提前一个月',
            addOnAfter:'号收租',
            tips:'（例如每期提前一个月1号，账期为6月12日到9月11日，非首期，则5月1日支付租金）'
        }]
    },
    housingRent:{
        apiKey:'housingRent',
        rules:{required: true, message: '请填写房屋租金'},
        label:'房屋租金：'
    },
    contractDate:{
        apiKey:'contractDate',
        label:'签约时间：',
        rules:{
            required: true, message: '请输入签约时间'
        }
    },
    colAccount:{
        apiKey:'colAccount',
        label:'收款账户：',
        rules:{
            required: true, message: '请输入收款账户'
        },
        initialValue:'北京路客互联网科技有限公司'
    },
    ifSettingManager:{
        apiKey:'ifSettingManager',
        rules:{},
        values:[{
            apiValue:true,
            value:'1',
            text:'设置为房屋管家'
        }]
    },
    sellManager:{
        apiKey:'sellManager',
        label:'销售管家：',
        rules:{
            required: true, message: '请输入销售管家'
        }
    }
};
class HandleLeaseInfo extends Component{
    constructor (props){
        super(props);
        this.state = {
            showLeaseModal:false,
            showRentReduceModal:false,
            apiData:{},
            tenantImages:[],
            contractImages:[]
        };
    }
    getConfig=(key)=>{
        const config = tableConfig;
        return key ? config[key] : config;
    };
    getData=()=>{
        const {form} = this.props;
        return {data:form.getFieldsValue()}
    };
    triggerState=(key)=>(val = false)=>()=>{
        this.setState({
            [key]:val
        })
    };
    getImageInfo=(key)=>{
        const self = this;
        return function (fileList) {
            console.log(fileList);
            let url = '';
            if(fileList.length > 0) {
                url = fileList[0].url
            }
            self.props.form.setFieldsValue({
                [key]: fileList
            })
        };
    };

    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 20 }
            }
        };
        const noLabelFormItemLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 0 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        };
        const FormItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 22 }
            }
        };
        const radioStyle = {
            width:"100%",
            display: 'flex',
            alignItems:'center'
        };
        const {form} = this.props;
        const { getFieldDecorator } = form;
        return <div>
            <div>补录租约/查看租约</div>
            <Row type={"flex"} justify={"space-between"}>
                <Col ><b>广州-越秀区-锦城花园-1号楼-1单元-1203-整租（0029838-订单编码）</b></Col>
                <Col >租约编号：2019483493483293</Col>
                <Col >租约状态：履约中</Col>
            </Row >
            <div>
                <div ><b >1、承租人信息</b ></div >
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('tenantName').label}
                        >
                            {getFieldDecorator(this.getConfig('tenantName').apiKey, {
                                rules: [ this.getConfig('tenantName').rules]
                            })(
                                <Input placeholder={this.getConfig('tenantName').placeholder}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('tenantId').label}
                        >
                            {getFieldDecorator(this.getConfig('tenantId').apiKey, {
                                rules: [ this.getConfig('tenantId').rules]
                            })(
                                <Input placeholder={this.getConfig('tenantId').placeholder}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('tenantIdPic').label}
                            help={this.getConfig('tenantIdPic').help}
                        >
                            {getFieldDecorator(this.getConfig('tenantIdPic').apiKey, {
                                // initialValue: landlordInfo && landlordInfo.avatar,
                                rules: [this.getConfig('tenantIdPic').rules]
                            })(
                                <UploadImage
                                    imageUrlList={this.state.tenantImages}
                                    imageLength={10}
                                    getImageInfo={this.getImageInfo(this.getConfig('tenantIdPic').apiKey) }
                                    placeholder={this.getConfig('tenantIdPic').placeholder}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('tenantPhone').label}
                        >
                            {getFieldDecorator(this.getConfig('tenantPhone').apiKey, {
                                rules: [ this.getConfig('tenantPhone').rules]
                            })(
                                <Input placeholder={this.getConfig('tenantPhone').placeholder}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('tenantSex').label}
                        >
                            {getFieldDecorator(this.getConfig('tenantSex').apiKey, {
                                rules: [ this.getConfig('tenantSex').rules]
                            })(
                                <Radio.Group>
                                    {this.getConfig('tenantSex').values.map((val,key)=>(
                                        <Radio key={key} value={val.value}>{val.text}</Radio>
                                    ))}
                                </Radio.Group>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('contractPic').label}
                            help={this.getConfig('contractPic').help}
                        >
                            {getFieldDecorator(this.getConfig('contractPic').apiKey, {
                                // initialValue: landlordInfo && landlordInfo.avatar,
                                rules: [this.getConfig('contractPic').rules]
                            })(
                                <UploadImage
                                    imageUrlList={this.state.contractImages}
                                    imageLength={30}
                                    getImageInfo={this.getImageInfo(this.getConfig('contractPic').apiKey)}
                                    placeholder={this.getConfig('contractPic').placeholder}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
            <hr />
            <div>
                <div ><b >2、租约信息</b ></div >
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('tenancy').label}
                        >
                            {getFieldDecorator(this.getConfig('tenancy').apiKey, {
                                rules: [ this.getConfig('tenancy').rules]
                            })(
                                <RangePicker />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('payWay').label}
                        >
                            {getFieldDecorator(this.getConfig('payWay').apiKey, {
                                rules: [this.getConfig('payWay').rules],
                                initialValue:this.getConfig('payWay').values.find(val=>val.isDefault).value
                            })(
                                <Select placeholder={this.getConfig('payWay').placeholder} style={{ width: "100%" }}>
                                    {this.getConfig('payWay').values.map((val,key)=>(
                                        <Option key={key} value={val.value}>{val.text}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('housingRent').label}
                        >
                            {getFieldDecorator(this.getConfig('housingRent').apiKey, {
                                rules: [this.getConfig('housingRent').rules]
                            })(
                                <Input addonAfter={"元"}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12} type={"flex"} align="middle" justify="center">
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('housingDeposit').label}
                        >
                            {getFieldDecorator(this.getConfig('housingDeposit').apiKey, {
                                rules: [this.getConfig('housingDeposit').rules],
                                initialValue:this.getConfig('housingDeposit').values.find(val=>val.isDefault).value
                            })(
                                <Select placeholder={this.getConfig('housingDeposit').placeholder} style={{ width: "100%" }}>
                                    {this.getConfig('housingDeposit').values.map((val,key)=>(
                                        <Option key={key} value={val.value}>{val.text}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...noLabelFormItemLayout}
                        >
                            {getFieldDecorator('housingCode', {
                                rules: [{
                                    required: true, message: '请输入房屋守则'
                                }],
                                initialValue:''
                            })(
                                <Input addonAfter={"元"}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12} type={"flex"} align="middle" justify="center">
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('serviceCharge').label}
                        >
                            {getFieldDecorator(this.getConfig('serviceCharge').apiKey, {
                                rules: [this.getConfig('serviceCharge').rules],
                                initialValue:this.getConfig('serviceCharge').values.find(val=>val.isDefault).value
                            })(
                                <Select placeholder={this.getConfig('serviceCharge').placeholder} style={{ width: "100%" }}>
                                    {this.getConfig('serviceCharge').values.map((val,key)=>(
                                        <Option key={key} value={val.value}>{val.text}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...noLabelFormItemLayout}
                        >
                            {getFieldDecorator(this.getConfig('serviceChargeValue').apiKey, {
                                rules: [this.getConfig('serviceChargeValue').rules],
                                initialValue:''
                            })(
                                <Input addonAfter={this.getConfig('serviceCharge').values.find(val=>val.value === form.getFieldValue('serviceCharge')).addOn}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem
                    {...FormItemLayout1}
                    label={this.getConfig('rentColDateSetting').label}
                >
                    {getFieldDecorator(this.getConfig('rentColDateSetting').apiKey, {
                        rules: [this.getConfig('rentColDateSetting').rules]
                    })(
                        <Radio.Group style={{ width: "100%" }}>
                            {this.getConfig('rentColDateSetting').values.map((val,key)=>{
                                const disabled = form.getFieldValue(this.getConfig('rentColDateSetting').apiKey) !== val.value;
                                return (
                                    <Radio key={key} value={val.value} style={radioStyle}>
                                        <div className="flex-inline flex-justify-content-center no-margin flex-align-items-center" >
                                            <div className="margin-right-def">{val.addOnBefore}</div>
                                            <FormItem
                                                {...noLabelFormItemLayout}
                                            >
                                                {getFieldDecorator(val.apiKey, {
                                                    rules: [val.rules],
                                                    initialValue:''
                                                })(
                                                    <Input
                                                        disabled={disabled}
                                                        addonAfter={val.addOnAfter}
                                                    />
                                                )}
                                            </FormItem>
                                            <div>{val.tips}</div>
                                        </div>
                                    </Radio>
                                )
                            })}
                        </Radio.Group>
                    )}
                </FormItem>
            </div>
            <hr />
            <div>
                <div ><b >3、销售信息</b ></div >
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('sellManager').label}
                        >
                            {getFieldDecorator(this.getConfig('sellManager').apiKey, {
                                rules: [this.getConfig('sellManager').rules],
                                initialValue:''
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...noLabelFormItemLayout}
                        >
                            {getFieldDecorator(this.getConfig('ifSettingManager').apiKey, {
                                rules: [this.getConfig('ifSettingManager').rules]
                            })(
                                <Checkbox.Group style={{ width: "100%" }}>
                                    <Row>
                                        {this.getConfig('ifSettingManager').values.map((val,key)=>(
                                            <Col span={8} key={key}><Checkbox value={val.value}>{val.text}</Checkbox></Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('tenantSource').label}
                        >
                            {getFieldDecorator(this.getConfig('tenantSource').apiKey, {
                                rules: [this.getConfig('tenantSource').rules],
                                initialValue:this.getConfig('tenantSource').values.find(val=>val.isDefault).value
                            })(
                                <Select placeholder={this.getConfig('tenantSource').placeholder} style={{ width: "100%" }}>
                                    {this.getConfig('tenantSource').values.map((val,key)=>(
                                        <Option key={key} value={val.value}>{val.text}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('contractDate').label}
                        >
                            {getFieldDecorator(this.getConfig('contractDate').apiKey, {
                                rules: [this.getConfig('contractDate').rules]
                            })(
                                <DatePicker />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.getConfig('colAccount').label}
                        >
                            {getFieldDecorator(this.getConfig('colAccount').apiKey, {
                                rules: [this.getConfig('colAccount').rules],
                                initialValue:this.getConfig('colAccount').initialValue
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
            <hr />
            <div>
                <div ><b >4、退租说明</b ></div >
                <Row gutter={12}>
                    <Col span={12}>
                        经手人：xxxxxx
                    </Col>
                    <Col span={12}>
                        时间：2018-12-25 12:09
                    </Col>
                    <Col span={12}>
                        退租发起人：xxxxxxxx
                    </Col>
                    <Col span={12}>
                        解除租约时间：xxxxxxxx
                    </Col>
                    <Col span={12}>
                        退租条款：xxxxxxxxx
                    </Col>
                </Row>
            </div>
            <Row type={"flex"} justify="space-around">
                <Button onClick={this.triggerState('showLeaseModal')(true)}>租金录入</Button>
                <Button onClick={this.props.onSubmitCb(this.getData())}>提交</Button>
                <Button onClick={this.props.onCancel}>取消</Button>
                <Button onClick={this.triggerState('showRentReduceModal')(true)}>退租</Button>
            </Row>
            <HandleLeaseModal
                visible={this.state.showLeaseModal}
                onCancel={this.triggerState('showLeaseModal')(false)}
            />
            <HandleRentReduceModal
                visible={this.state.showRentReduceModal}
                onCancel={this.triggerState('showRentReduceModal')(false)}
            />

        </div>;
    }
}
export default Form.create()(HandleLeaseInfo)
