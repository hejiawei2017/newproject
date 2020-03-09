import React, {Component, Fragment} from 'react'
import {
    Modal,
    Form,
    Input,
    Select,
    Row,
    Col,
    Radio,
    InputNumber,
    DatePicker,
    Checkbox,
    Icon,
    Popover,
    Tag,
    Tooltip,
    Spin
} from 'antd';
import PropTypes from 'prop-types'
import moment from 'moment'
import {dataFormat} from "../../utils/utils";
import './index.less'
import { Map } from 'react-amap';

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RangePicker = DatePicker.RangePicker
const CheckboxGroup = Checkbox.Group
const {TextArea} = Input
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18}
    }
}
const formOverspeardLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 3}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 21}
    }
}
const defaultSpan = {
    span: 12
}

class OperateCouponModal extends Component {
    static getDerivedStateFromProps (){
        return {
            isEdit: 'edit'
        }
    }

    static defaultProps = {
        behavior: 'default',
        couponDetail: null,
        openTwoLevel: false
    }
    static propTypes = {
        behavior: PropTypes.string,
        couponDetail: PropTypes.object,
        onCancel: PropTypes.func,
        openTwoLevel: PropTypes.bool
    }
    state = {
        behavior: 'add',
        isEdit: false,
        validityPeriodStatus: 'absolute',
        sendCountVisible: true
    }
    onCancel = () => {
        this.props.onCancel()
    }
    selectRadio = item => {
        if (item.target.value === 'unlimited') {
            this.setState({
                sendCountVisible: false
            })
        } else {
            this.setState({
                sendCountVisible: true
            })
        }
    }
    renderCouponContent = () => {
        const {editContent} = this.props
        let freeTypes = []
        let couponType = null
        if(editContent){
            const {coupon:{couponRules}} = editContent
            const feeTypes = JSON.parse(couponRules.feeTypes)
            for( const i in feeTypes){
                if(feeTypes[i] === 1){
                    freeTypes.push('首晚房晚价格')
                }else if(feeTypes[i] === 2){
                    freeTypes.push('房晚实际价格')
                }else if(feeTypes[i] === 3){
                    freeTypes.push('清洁费')
                }else if(feeTypes[i] === 4){
                    freeTypes.push('预订服务费')
                }else if(feeTypes[i] === 5){
                    freeTypes.push('保险费')
                }else if(feeTypes[i] === 6){
                    freeTypes.push('商务出行套餐费')
                }
            }
            couponType = editContent.coupon.couponRules.couponType
        }
        return (
            <div>
                <p>优惠券模式:{editContent && editContent.coupon.couponRules.express}</p>
                <p>优惠券类型:{editContent && couponType === 1 ? '立减券' : couponType === 2 ? '折扣券' : couponType === 3 ? '满减券' : ''}</p>
                <p>优惠项:{JSON.stringify(freeTypes)}</p>
                <p>成本计算:{editContent && editContent.coupon.couponRules.calculatePrice}</p>
            </div>
        )
    }
    onSubmit = () =>{
        const {validateFields} = this.props.form
        validateFields((error, values) => {
            this.props.onSubmit(error, values)
        })
    }
    renderBaseInfo = () => {
        const {getFieldDecorator} = this.props.form
        const {editContent} = this.props
        return (
            <div>
                <h1 className="form-title">基本信息</h1>
                <Row gutter={6}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="优惠券名称"
                        >
                            {getFieldDecorator('couponName', {
                                initialValue: editContent ? editContent.coupon.couponName : ''
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem
                            {...formItemLayout}
                            label="金额规则"
                        >
                            {getFieldDecorator('couponRule', {
                                initialValue: editContent ? editContent.coupon.couponRules.rulesName : ''
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <Popover placement="left" content={this.renderCouponContent()}>
                            <Icon type="question-circle"/>
                        </Popover>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="发放数量"
                        >
                            <Col span={6}>
                                <FormItem>
                                    {getFieldDecorator('isLimit', {
                                        initialValue: editContent && editContent.coupon.couponQuantity === '-1' ? 1 : 0
                                    })(
                                        <RadioGroup disabled>
                                            <Radio key="0" value={0}>有限制</Radio>
                                            <Radio key="1" value={1}>无限制</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={3}>
                                <FormItem>
                                    {editContent && editContent.coupon.couponQuantity && getFieldDecorator('count', {
                                        initialValue: editContent && editContent.coupon.couponQuantity
                                    })(
                                        <InputNumber disabled/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={1}>份</Col>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...defaultSpan}>
                        <FormItem
                            {...formItemLayout}
                            label="使用说明"
                        >
                            {getFieldDecorator('useage', {
                                initialValue: editContent && editContent.coupon.description
                            })(
                                <TextArea autosize={{minRows: 2, maxRows: 6}} disabled/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }
    renderBaseRule = () => {
        const {getFieldDecorator} = this.props.form
        const {userList, channelList,houseTagList, editContent} = this.props
        let couponUserLabel = []
        if (editContent) {
            const {couponUserLabels} = editContent.coupon
            for (let i in couponUserLabels) {
                couponUserLabel.push(couponUserLabels[i].id)
            }
        }
        let couponChannel = []
        let couponCity = [];
        let couponHouseTag = [];
        if(editContent){
            couponHouseTag = editContent.coupon.houseSourceTagView
            couponCity = editContent.coupon.cityNamesView
            const {couponChannels} = editContent.coupon
            for(let i in couponChannels){
                couponChannel.push(couponChannels[i].id)
            }
        }
        return (
            <div>
                <Row>
                    <Col>
                        <h1 className="form-title">基本规则</h1>
                    </Col>
                </Row>
                <Row className="userTags">
                    <Col style={{width:'100%',display:'block'}}>
                        <FormItem
                            style={{width:'100%',display:'block'}}
                            {...formOverspeardLayout}
                            label="用户标签"
                        >
                            {getFieldDecorator('userTagsId', {
                                initialValue :editContent ? couponUserLabel : []
                            })(
                                <CheckboxGroup style={{marginTop:10}} disabled>
                                <Row style={{width:'100%',display:'block'}}>
                                {userList.map(item=>{
                                    return <Col key={item.id} span={6}><Checkbox key={item.id} value={item.id}>{item.labelName}</Checkbox></Col>
                                })}
                                </Row>
                            </CheckboxGroup>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="领取限制"
                        >
                            <Col span={16}>
                                <FormItem>
                                    {getFieldDecorator('getLimit', {
                                        initialValue: editContent ? editContent.coupon.receiveLimitType : ''
                                    })(
                                        <RadioGroup disabled>
                                            <Radio value={0}>无限制</Radio>
                                            <Radio value={1}>每人每日限领</Radio>
                                            <Radio value={2}>每人限领</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            {editContent && editContent.coupon.receiveLimitType !== 0 &&
                            <Fragment>
                                <Col span={3}>
                                    <FormItem>
                                        {getFieldDecorator('fen', {
                                            initialValue: editContent ? editContent.coupon.receiveLimit : ''
                                        })(
                                            <InputNumber disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={1}>张</Col>
                            </Fragment>}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="有效期"
                        >
                            <Col span={7}>
                                <FormItem>
                                    {getFieldDecorator('validityPeriodType', {
                                        initialValue: editContent ? editContent.coupon.validityPeriodType : ''
                                    })(
                                        <RadioGroup disabled>
                                            <Radio value={1}>绝对时间</Radio>
                                            <Radio value={2}>相对时间</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            {editContent && editContent.coupon.validityPeriodType === 1 ? (
                                <Col span={15}>
                                    {getFieldDecorator('range-picker', {
                                        initialValue: editContent ? [moment(dataFormat(editContent.coupon.startTime)),moment(dataFormat(editContent.coupon.endTime))] : []
                                    })(
                                        <RangePicker format="YYYY-MM-DD HH:mm:ss" disabled/>
                                    )}
                                </Col>
                            ) : (
                                <Col span={16}>
                                    <Col span={3}>
                                        <FormItem>
                                            {getFieldDecorator('effective', {
                                                initialValue: editContent ? editContent.coupon.afterEffectiveDays : ''
                                            })(
                                                <InputNumber disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        天生效，生效天数
                                    </Col>
                                    <Col span={3}>
                                        <FormItem>
                                            {getFieldDecorator('day', {
                                                initialValue: editContent ? editContent.coupon.effectiveDays : ''
                                            })(
                                                <InputNumber disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Col>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...defaultSpan}>
                        <FormItem
                            {...formItemLayout}
                            label="使用限制"
                        >
                            {getFieldDecorator('useLimit', {
                                initialValue: editContent ? editContent.coupon.useRestrictionType : ''
                            })(
                                <RadioGroup disabled>
                                    <Radio value={1}>
                                        不可叠加使用，与其他优惠（会员折扣、优惠券等）排斥
                                    </Radio>
                                    <Radio value={2}>
                                        不可叠加使用，但允许与会员折扣同时使用
                                    </Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className="userTags">
                    <Col style={{width:'100%',display:'block'}}>
                        <FormItem
                            style={{width:'100%',display:'block'}}
                            {...formOverspeardLayout}
                            label="适用渠道"
                        >
                            {getFieldDecorator('check', {
                                initialValue :editContent ? couponChannel : []
                            })(
                                <CheckboxGroup style={{marginTop:10}} disabled>
                                <Row style={{width:'100%',display:'block'}}>
                                {channelList.map(item=>{
                                    return <Col span={6}><Checkbox value={item.id}>{item.channelName}</Checkbox></Col>
                                })}
                                </Row>
                            </CheckboxGroup>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="房源标签"
                        >
                            {getFieldDecorator('houseTagName',{
                                rules: [{
                                    required: false,
                                    message:'请选择标签'
                                }],
                                initialValue:editContent ? couponHouseTag : []
                            })(
                                <CheckboxGroup style={{marginTop:10,width:"100%"}} disabled>
                                    <Row>
                                        {houseTagList.map(item=>{
                                            return <Col span={6} key={item.id}><Checkbox value={item.name}>{item.name}</Checkbox></Col>
                                        })}
                                    </Row>
                                </CheckboxGroup>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="城市选择"
                        >
                            {getFieldDecorator('couponCityName',{
                                rules: [{
                                    required: false,
                                    message:'请选择城市'
                                }],
                                initialValue:editContent ? couponCity : []
                            })(
                                <Select
                                    mode="multiple"
                                    disabled
                                    placeholder="选择城市"
                                    style={{ width: '100%' }}
                                >
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <FormItem
                        {...formOverspeardLayout}
                        label="房晚限制"
                    >
                        <Col span={6}>
                            <FormItem>
                                {getFieldDecorator('nightsLimit', {
                                    initialValue: editContent && editContent.coupon.nightsLimit === -1 ? -1 : 1
                                })(
                                    <RadioGroup disabled>
                                        <Radio value={1}>有限制</Radio>
                                        <Radio value={-1}>无限制</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        {editContent && editContent.coupon.nightsLimit !== -1 &&
                        <Col span={8}>
                            <FormItem>
                                {getFieldDecorator('nights', {
                                    initialValue: editContent ? editContent.coupon.nightsLimit : null
                                })(
                                    <Input
                                        disabled
                                        addonBefore={'预定'}
                                        addonAfter={'个房晚方可使用'}
                                    />
                                )}
                            </FormItem>
                        </Col>}
                        {this.state.nightsVisible &&
                        <Col span={9}>
                            <FormItem>
                            {getFieldDecorator('workDays',{
                                initialValue:1,
                                rules:[{
                                    required : true,
                                    type:'number',
                                    message:'请填写数字',
                                    transform: (value)=>{
                                        return Number(value);
                                    }
                                }]
                            })(<Input addonBefore={'且需包含'} addonAfter={'个工作日可用'}/>)}
                            </FormItem>
                        </Col>}
                        {this.state.nightsVisible && <Col span={1}><Tooltip title={'工作日是指：周日至周四，不包括法定节假日'}><Icon type="question-circle"/></Tooltip></Col>}
                    </FormItem>
                </Row>
            </div>
        )
    }
    renderOneLevelApproval = () => {
        const {getFieldDecorator} = this.props.form
        const {openTwoLevel,editContent} = this.props
        let state = null ;
        if(editContent){
            state = editContent.coupon.couponReviews[0].state
        }
        return (
            <div>
                <Row>
                    <Col>
                        <h1 className="form-title">一级审批</h1>
                    </Col>
                </Row>
                <Row>
                    <Col {...defaultSpan}>
                        {!openTwoLevel ? (
                            <FormItem
                                {...formItemLayout}
                                label="审批结果"
                            >
                                {getFieldDecorator('state', {
                                    initialValue: 1,
                                    rules: [{
                                        required: true
                                    }]
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>通过</Radio>
                                        <Radio value={2}>不通过</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        ) : (
                            <FormItem
                                {...formItemLayout}
                                label="审批结果"
                            >
                                <Tag color="#87d068">{editContent && state === 0 ? '待审批' : state === 1 ? '审批通过' : '审批不通过'}</Tag>
                            </FormItem>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col {...defaultSpan}>
                        {openTwoLevel ? (
                            <FormItem
                                {...formItemLayout}
                                label="审批意见"
                            >
                                {getFieldDecorator('suggestion',{
                                    initialValue: editContent && editContent.coupon && editContent.coupon.couponReviews ? editContent.coupon.couponReviews[0].opinion : ''
                                })(
                                    <TextArea disabled/>
                                )}
                            </FormItem>
                        ) : (
                            <FormItem
                                {...formItemLayout}
                                label="审批意见"
                            >
                                {getFieldDecorator('suggestion',)(
                                    <TextArea/>
                                )}
                            </FormItem>
                        )}
                    </Col>
                </Row>
            </div>
        )
    }
    renderTwoLevelApproval = () => {
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Row>
                    <Col>
                        <h1 className="form-title">二级审批</h1>
                    </Col>
                </Row>
                <Row>
                    <Col {...defaultSpan}>
                        <FormItem
                            {...formItemLayout}
                            label="审批结果"
                        >
                            {getFieldDecorator('twoLevelResult', {
                                initialValue: 1 ,
                                rules: [{
                                    required: true
                                }]
                            })(
                                <RadioGroup>
                                    <Radio value={1}>通过</Radio>
                                    <Radio value={2}>不通过</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...defaultSpan}>
                        <FormItem
                            {...formItemLayout}
                            label="审批意见"
                        >
                            {getFieldDecorator('twoLevelSuggestion',)(
                                <TextArea/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }

    render () {
        const {visible, openTwoLevel} = this.props
        return (
            <Modal
                title={'审核优惠券'}
                visible={visible}
                onCancel={this.onCancel}
                width="840px"
                wrapClassName="scroll-center-modal"
                onOk={this.onSubmit}
                style={{top: 0}}
                destroyOnClose
            >
                <Form>
                    {this.renderBaseInfo()}
                    {this.renderBaseRule()}
                    {this.renderOneLevelApproval()}
                    {openTwoLevel ? this.renderTwoLevelApproval() : null}
                </Form>
            </Modal>
        )
    }
}

OperateCouponModal = Form.create()(OperateCouponModal)

export default OperateCouponModal
