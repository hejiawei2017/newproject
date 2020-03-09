import React, { Component,Fragment } from 'react'
import { Modal, Form, Select, Input, InputNumber, Row, Col, Checkbox, Button, Radio } from 'antd'
import PropTypes from 'prop-types'
import { couponService } from '../../services'
import { thanMap } from '../../utils/dictionary'
import { inputNumberFormat, inputNumberPercent } from '../../utils/utils'

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
    }
}
const formSamllItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
    }
}
const formOverspeardLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 }
    }
}
const defaultSpan = {
    span: 12
}
class OperateModal extends Component {
    static defaultProps = {
        title: '',
        visible: false
    }
    static propTypes = {
        onCancel: PropTypes.func,
        visible: PropTypes.bool,
        title: PropTypes.string
    }
    constructor (props){
        super(props)
        this.state = {
            testLoading:false,
            testResult : 0
        }
        this.onCancel = this.onCancel.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.checkTest = this.checkTest.bind(this)
    }
    componentWillReceiveProps (nextProps){
        if(nextProps.visible === false){
            this.setState({
                testResult: 0
            })
        }
    }
    onCancel = () => {
        this.props.onCancel()
    }
    onSubmit = () => {
        this.props.form.validateFields((error, value) => {
            this.props.onSubmit(error, value,this.props.editData ? 'edit' : 'add')
        })
    }
    changePercent = (field) => (count) => {
        const { setFieldsValue } = this.props.form
        setFieldsValue({
            [field]: 100 - count
        })
    }
    checkTest = () =>{
        this.setState({testLoading:true})
        this.props.form.validateFields((error, value) => {
            if(value.costExpress === ""){
                this.setState({testLoading:false})
                return false
            }
            let params = {
                "costExpress": value.costExpress,//表达式
                "firstNightPrice": value.firstNightPrice, //首晚房价 默认为0
                "allActualRoomTotalPrice": value.allActualRoomTotalPrice, //全部房晚实际总价 默认为0
                "cleaningFee": value.cleaningFee, //清洁费 默认为0
                "memberDiscount": value.memberDiscount, //会员折扣，例如打9折，即0.9 默认为1
                "preferentialPrice": value.preferentialPrice, //已优惠金额  默认为0
                "servicePrice": value.servicePrice || 0, //预订服务费 默认为0
                "insurance": value.insurance, //保险费 默认为0
                "businessPrice": value.businessPrice//商务出行套餐费 默认为0
            }
            couponService.getTest(params).then((data)=>{
                this.setState({
                    testResult:data,
                    testLoading:false
                })
            }).catch(()=>{
                this.setState({
                    testLoading:false
                })
            })
        })
    }
    renderField = (key) => {
        const { getFieldDecorator } = this.props.form;
        const { editData } = this.props;
        return (
            <Fragment>
                <Row gutter={4}>
                    <Col span={3}>
                        <span style={{height:'100%',display:'inline-block',lineHeight:'42px'}}>成本项:</span>
                    </Col>
                    <Col span={12}>
                        <FormItem>
                            {getFieldDecorator(`cost${key}`, {
                                initialValue: editData ? key === 0 ? (editData.express.costRatio) * 100 : (editData.express.totalFeeRatio) * 100 : 8
                            })(
                                <InputNumber
                                    disabled={this.checkModal()}
                                    min={0}
                                    max={100}
                                    formatter={inputNumberFormat('%')}
                                    parser={inputNumberPercent('%')}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem>
                            {getFieldDecorator(`than${key}`, {
                                initialValue: editData ? key === 0 ? editData.express.operatorValue1 : editData.express.operatorValue2 : '>='
                            })(
                                <Select disabled={this.checkModal()}>
                                    { thanMap.map( item => {
                                        return <Option key={item.value} value={item.value}>{item.label}</Option>
                                    } ) }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem>
                            {getFieldDecorator(`momey`,{
                                initialValue: editData ? editData.express.calculatePrice : ''
                            })(
                                <InputNumber
                                    disabled={this.checkModal()}
                                    min={0}
                                    max={1000000}
                                    formatter={inputNumberFormat('元')}
                                    parser={inputNumberPercent('元')}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Fragment>
        )
    }
    renderSubtract = () => {
        const { getFieldDecorator } = this.props.form;
        const { editData } = this.props;
        return (
            <FormItem
                {...formItemLayout}
                label="立减面额"
            >
                {getFieldDecorator('subtractMoney', {
                    rules: [{
                        required: true,
                        message: '请输入金额'
                    }],
                    initialValue: editData ? editData.faceValue : ''
                })(
                    <InputNumber
                        disabled = {this.checkModal()}
                        min={0}
                        formatter={inputNumberFormat('元')}
                        parser={inputNumberPercent('元')}
                    />
                )}
            </FormItem>
        )
    }
    checkModal = () =>{
        let behavior = this.props.behavior
        if(behavior === 'view'){
            return true
        }
        return false
    }
    renderDiscount = () => {
        const { getFieldDecorator } = this.props.form;
        const { editData } = this.props;
        return (
            <FormItem
                {...formItemLayout}
                label="折扣"
                extra="案例：设置0.5为前端5折"
            >
                {getFieldDecorator('discountMoney', {
                    rules: [{
                        required: true,
                        message: '请输入折扣'
                    }],
                    initialValue: editData ? editData.discount : ''
                })(
                    <InputNumber
                        min={0}
                        max={1}
                        disabled={this.checkModal()}
                    />
                )}
            </FormItem>
        )
    }
    renderFullSubtract = () => {
        const { getFieldDecorator } = this.props.form;
        const { editData } = this.props;
        return (
            <Row>
                <Col span={12}>
                    <FormItem
                        {...formSamllItemLayout}
                        label="满"
                    >
                        {getFieldDecorator('fullMoney', {
                            rules: [{
                                required: true,
                                message: '请输入满减金额'
                            }],
                            initialValue:editData ? editData.fullValue : ''
                        })(
                            <InputNumber
                                disabled = {this.checkModal()}
                                min={0}
                                formatter={inputNumberFormat('元')}
                                parser={inputNumberPercent('元')}
                            />
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        {...formSamllItemLayout}
                        label="减"
                    >
                        {getFieldDecorator('fullSubtractMoney', {
                            rules: [{
                                required: true,
                                message: '请输入满减金额'
                            }],
                            initialValue: editData ? editData.reduceValue : ''
                        })(
                            <InputNumber
                                disabled = {this.checkModal()}
                                min={0}
                                formatter={inputNumberFormat('元')}
                                parser={inputNumberPercent('元')}
                            />
                        )}
                    </FormItem>
                </Col>
            </Row>
        )
    };
    renderForm = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { editData } = this.props;
        const options = [
            {value: 1, label: '首晚房晚价格'},
            {value: 2, label: '房晚实际价格'},
            {value: 3, label: '清洁费'},
            // {value: 4, label: '预订服务费'},
            {value: 5, label: '保险费'},
            {value: 6, label: '商务出行套餐费'}
        ];
        const type = [
            {value: 1, label: '立减'},
            {value: 2, label: '折扣'},
            {value: 3, label: '满减'}
        ];
        const costs = [
            {value: 1, label: '首晚房晚价格'},
            {value: 2, label: '房晚实际价格'},
            {value: 3, label: '清洁费'}
        ];
        const radio = [
            {value: 1, label: '会员折扣成本分担'},
            {value: 2, label: '优惠金额成本分担（房东报名参加活动）'}
        ];
        const memberType = [
            {value: 1, label: '体验黑卡会员'},
            {value: 2, label: '体验银卡会员'},
            {value: 3, label: '体验金卡会员'}
        ]
        return (
            <Form>
                <Row>
                    <Col {...defaultSpan}>
                        <FormItem
                            {...formItemLayout}
                            label="规则名称"
                        >
                            {getFieldDecorator('rulesName', {
                                rules: [{
                                    required: true,
                                    max: 10,
                                    message: '请输入规则名称'
                                }],
                                initialValue:editData ? editData.rulesName : ''
                            })(
                                <Input disabled = {this.checkModal()} placeholder="方便记忆和查询" />
                            )}
                        </FormItem>
                    </Col>
                    <Col {...defaultSpan}>
                        <FormItem
                            {...formItemLayout}
                            label="优惠券模式"
                        >
                            {getFieldDecorator('pattern', {
                                initialValue: 'absolute'
                            })(
                                <Select disabled = {this.checkModal()}>
                                    <Option value="absolute">
                                        固定模式
                                    </Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...defaultSpan}>
                        <FormItem
                            {...formItemLayout}
                            label="优惠券类型"
                        >
                            {getFieldDecorator('couponType', {
                                initialValue: editData ? editData.couponType : 1
                            })(
                                <Select disabled = {this.checkModal()}>
                                    { type.map( v => (
                                        <Option key={v.value} value={v.value}>{v.label}</Option>
                                    ) ) }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...defaultSpan} >
                        {
                            getFieldValue(`couponType`) === 1
                                ? this.renderSubtract()
                                : getFieldValue(`couponType`) === 2
                                    ? this.renderDiscount()
                                    : this.renderFullSubtract()
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="优惠项"
                        >
                            {getFieldDecorator('free',{
                                initialValue: editData ? JSON.parse(editData.feeTypes) : [1]
                            })(
                                <CheckboxGroup options={options} disabled = {this.checkModal()}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="成本分担"
                        >
                            {getFieldDecorator('costSharingType',{
                                initialValue: editData ? editData.costSharingType : 2
                            })(
                                <RadioGroup options={radio} disabled = {this.checkModal()}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {
                    getFieldValue('costSharingType') === 1 &&
                    <Row>
                        <Col>
                            <FormItem
                                {...formOverspeardLayout}
                                label="会员类型"
                            >
                                {getFieldDecorator('memberType',{
                                    initialValue: editData ? editData.memberType : 1
                                })(
                                    <Select disabled = {this.checkModal()}>
                                        { memberType.map( v => (
                                            <Option key={v.value} value={v.value}>{v.label}</Option>
                                        ) ) }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                }
                <Row>
                    <Col>
                        <div className="text-content">
                            可用关键字：首晚房价 全部房晚实际总价 清洁费 保险费 商务出行套餐费 会员折扣 已优惠金额<br></br>
                            可用操作符：如果 则 否则 小于 小于等于 大于 大于等于 等于 不等于 并且 或者 （ ）+ - * /<br></br>
                            例子：如果 (首晚房价 + 全部房晚实际总价 * 2) 大于 0 则 清洁费 否则 首晚房价 * 会员折扣<br></br>
                            ps:所有关键字之间必须要有空格
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            label="路客承担成本计算表达式："
                        >
                            {getFieldDecorator('costExpress',{
                                rules: [{
                                    required: true,
                                    message: '请输入表达式'
                                }],
                                initialValue: editData ? editData.costExpress : ''
                            })(
                                <TextArea
                                    disabled = {this.checkModal()}
                                    rows={4}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div className="steps-content">
                    <Row>
                        <Col>
                            输入模拟数据，可以验证你的表达式，是否如你预期所想，正确执行
                        </Col>
                    </Row>
                    <Row>
                        <Col {...defaultSpan}>
                                <FormItem
                                    {...formItemLayout}
                                    label="首晚房价"
                                >
                                    {getFieldDecorator('firstNightPrice', {
                                        initialValue: 0
                                    })(
                                        <InputNumber />
                                    )}
                                </FormItem>
                        </Col>
                        <Col {...defaultSpan}>
                            <FormItem
                                {...formItemLayout}
                                label="保险费"
                            >
                                {getFieldDecorator('insurance', {
                                     initialValue: 0
                                })(
                                    <InputNumber />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col {...defaultSpan}>
                                <FormItem
                                    {...formItemLayout}
                                    label="全部房晚实际总价"
                                >
                                    {getFieldDecorator('allActualRoomTotalPrice', {
                                        initialValue: 0
                                    })(
                                        <InputNumber />
                                    )}
                                </FormItem>
                        </Col>
                        <Col {...defaultSpan}>
                            <FormItem
                                {...formItemLayout}
                                label="商务出行套餐费"
                            >
                                {getFieldDecorator('businessPrice', {
                                     initialValue: 0
                                })(
                                    <InputNumber />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col {...defaultSpan}>
                                <FormItem
                                    {...formItemLayout}
                                    label="清洁费"
                                >
                                    {getFieldDecorator('cleaningFee', {
                                        initialValue: 0
                                    })(
                                        <InputNumber />
                                    )}
                                </FormItem>
                        </Col>
                        <Col {...defaultSpan}>
                            <FormItem
                                {...formItemLayout}
                                label="会员折扣(例如打9折,即填0.9)"
                            >
                                {getFieldDecorator('memberDiscount', {
                                     initialValue: 1
                                })(
                                    <InputNumber />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="bd-dashed">
                        <Col {...defaultSpan}>
                            <FormItem
                                {...formItemLayout}
                                label="已优惠金额"
                            >
                                {getFieldDecorator('preferentialPrice', {
                                     initialValue: 0
                                })(
                                    <InputNumber />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="mt5">
                        <Col {...defaultSpan} className="text-center ant-span-red">
                            计算结果：{this.state.testResult || 0}
                        </Col>
                        <Col {...defaultSpan}>
                            <Button type="primary" loading={this.state.testLoading} onClick={this.checkTest}>验证</Button>
                        </Col>
                    </Row>
                </div>
            </Form>
        )
    }
    renderFooter () {
        let footerList = [<Button key="btn1" onClick={this.onCancel}>关闭</Button>]
        if(this.props.behavior !== 'view'){
            footerList.push(<Button key="btn2" className="ant-btn-primary" onClick={this.onSubmit}>保存</Button>)
        }
        return footerList
    }
    render () {
        const { visible, title } = this.props
        return (
            <div>
                <Modal
                    title={title}
                    visible={visible}
                    onCancel={this.onCancel}
                    width="960px"
                    wrapClassName="scroll-center-modal"
                    style={{top:0}}
                    footer={this.renderFooter()}
                    okText="保存"
                    destroyOnClose
                >
                    { this.renderForm() }
                </Modal>
            </div>
        )
    }
}

OperateModal = Form.create()(OperateModal)

export default OperateModal
