import React, {Component, Fragment} from 'react'
import {Modal, Form, Input, Select, Spin, Row, Col,Switch, Radio, InputNumber, DatePicker, Checkbox, Icon, Popover,Tooltip,Button} from 'antd'
import PropTypes from 'prop-types'
import SubTable from '../../components/subTable/index'
import moment from 'moment'
import './index.less'
import {orderListService} from '../../services'
import {dataFormat} from "../../utils/utils";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
const {TextArea} = Input;
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18}
    }
};
const formOverspeardLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 3}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 21}
    }
};
const defaultSpan = {
    span: 12
};


function disabledDate (current) {
    // 不能选择当天和之前的日期
    return current && current < moment().endOf('day');
}
class OperateCouponModal extends Component {
    constructor (props) {
        super(props);
        this.lastFetchId = 0;
    }
    state = {
        festivalVisible: false,
        behavior: 'add',
        isEdit: false,
        validityPeriodStatus: 1,
        bookValidityPeriodStatus: 1,
        couponQuantity: "0",
        nightsVisible: true,
        receiveLimit: true,
        express:null,
        isTimeDay: true,
        isBookTimeDay: true,
        cityData: [],
        cityValue: [],
        cityFetching: false
    };
    componentWillReceiveProps (nextProps){
        if(nextProps.readContent){
            this.setState({
                couponQuantity:this.getCouponQuantity(nextProps.readContent),
                express:this.props.ruleList.find(item => item.id === nextProps.readContent.couponRules.id ),
                receiveLimit:nextProps.readContent.receiveLimitType !== 0,
                validityPeriodStatus:nextProps.readContent.validityPeriodType,
                bookValidityPeriodStatus:nextProps.readContent.bookPeriodType,
                nightsVisible:nextProps.readContent.nightsLimit !== -1,
                isTimeDay:nextProps.readContent.effectiveDays !== null,
                isBookTimeDay:nextProps.readContent.bookEffectiveDays !== null
            })
        }else if(nextProps.behavior === "add" && this.props.readContent){
            this.setState({
                couponQuantity: "0",
                express:null,
                receiveLimit:true,
                validityPeriodStatus:1,
                bookValidityPeriodStatus:1,
                nightsVisible:true,
                isTimeDay:true,
                isBookTimeDay:true
            })
        }
    }
    onSubmit = () => {
        const {validateFields} = this.props.form
        const behavior = this.props.behavior
        const id = this.props.readContent && this.props.readContent.id ? this.props.readContent.id : ''
        validateFields((error, values) => {
            this.props.onSubmit(error, values, behavior, id)
        })
    };
    onCancel = () => {
        this.props.onCancel()
    };
    fetchCity = (value) => {
        if(value){
            this.timer && clearTimeout(this.timer)
            this.lastFetchId += 1;
            const fetchId = this.lastFetchId;
            this.setState({ cityData: [], cityFetching: true });
            this.timer = setTimeout(() =>{
                const params = {
                    areaLevel: 3,
                    nameLike: value
                }
                orderListService.getCitylist(params).then((data) =>{
                    if (fetchId !== this.lastFetchId) {
                        return;
                    }
                    const cityData = data.list
                    this.setState({ cityData, cityFetching: false });
                })
            },500)
        }

    };
    handleChange = (city) => {
        this.setState({
            cityValue: city.name,
            cityData: [],
            cityFetching: false
        });
    };
    selectRadio = item => {
        if (item.target.value === "-1") {
            this.setState({
                couponQuantity: "-1"
            })
        } else {
            this.setState({
                couponQuantity: "0"
            })
        }
    };
    nightsLimit = item => {
        if (item.target.value === -1) {
            this.setState({
                nightsVisible: false
            })
        } else {
            this.setState({
                nightsVisible: true
            })
        }
    };
    receiveLimit = item => {
        if (item.target.value === 0) {
            this.setState({
                receiveLimit: false
            })
        } else {
            this.setState({
                receiveLimit: true
            })
        }
    };
    changeTimeDay = item => {
        this.setState({
            isTimeDay: item
        })
    };
    changeBookTimeDay = item => {
        this.setState({
            isBookTimeDay: item
        })
    };
    selectValidityPeriod = item => {
        this.setState({
            validityPeriodStatus: item.target.value
        })
    };
    selectBookValidityPeriod = item => {
        this.setState({
            bookValidityPeriodStatus: item.target.value
        })
    };
    ruleListChange =(value)=>{
         if(value !== 'no'){
            this.setState({express:this.props.ruleList.find(item => item.id === value)}, ()=>{
                if(this.state.express && this.state.express.costSharingType === 1){
                    this.props.form.setFieldsValue({'useRestrictionType': 1})
                }
            })
        }else{
            this.setState({express:null})
        }
    };
    renderCouponContent = () => {
        const {express} = this.state;
        if(express === null){
            return <span>请选择金额规则</span>
        }
        const feeTypes = JSON.parse(express.feeTypes);
        let freeTypes = [];
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
        return (
            <div>
                <p>优惠券模式:{express.rulesName}</p>
                <p>优惠券类型:{express.couponType === 1 ? '立减券' : express.couponType === 2 ? '折扣券' : '满减券'}</p>
                <p>优惠项:{
                    JSON.stringify(freeTypes)
                }</p>
                <p>成本计算:{express.express}</p>
            </div>
        )
    };
    getCouponQuantity = (readContent) =>{
        if(readContent === null){
            return "0"
        }else if(Number (readContent.couponQuantity) > 0){
            return "0"
        }else{
            return "-1"
        }
    }
    renderBaseInfo = () => {
        const {getFieldDecorator} = this.props.form;
        const {ruleList,readContent} = this.props;
        return (
            <div>
                <h1 className="form-title">基本信息(必填)</h1>
                <Row gutter={6}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="优惠券名称"
                        >
                            {getFieldDecorator('couponName', {
                                rules: [{
                                    max: 15,
                                    required: true,
                                    message: '请输入15位以内的优惠券名称'
                                }],
                                initialValue:readContent ? readContent.couponName : ''
                            })(
                                <Input disabled={this.props.behavior === 'edit' ? false : !!readContent}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem
                            {...formItemLayout}
                            label="金额规则"
                        >
                            {getFieldDecorator('moneyRuleId', {
                                rules: [{
                                    required: true,
                                    message: '请选择金额规则'
                                }],
                                initialValue:readContent ? readContent.couponRules.id : ''
                            })(
                                <Select onChange={this.ruleListChange}>
                                <Option value={''} key>请选择</Option>
                                    {ruleList.map(item => {
                                        return <Option value={item.id} key={item.id}>{item.rulesName}</Option>
                                    })}
                                </Select>
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
                                        initialValue: this.getCouponQuantity(readContent)
                                    })(
                                        <RadioGroup
                                            onChange={this.selectRadio}
                                        >
                                            <Radio key="0" value={"0"}>有限制</Radio>
                                            <Radio key="-1" value={"-1"}>无限制</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem>
                                    {this.state.couponQuantity !== "-1" && getFieldDecorator('count', {
                                    rules: [{
                                        required : true,
                                        type:'number',
                                        message:'请填写数字',
                                        min:1,
                                        transform: (value)=>{
                                            return Number(value);
                                        }
                                    }],
                                        initialValue: readContent ? readContent.couponQuantity : 1
                                    })(
                                        <Input
                                            addonAfter={'份'}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="使用规则"
                        >
                            {getFieldDecorator('description', {
                                rules: [{
                                    required: true,
                                    min: 10,
                                    message: '请输入十字以上的使用规则'
                                }],
                                initialValue:readContent ? readContent.description : ''
                            })(
                                <TextArea autosize={{minRows: 3, maxRows: 6}} disabled={this.props.behavior === 'edit' ? false : !!readContent}/>
                            )}
                        </FormItem>
                        <FormItem
                                {...formItemLayout}
                                label="简称规则"
                        >
                                {getFieldDecorator('synopsis', {
                                    rules: [{
                                        required: true,
                                        min: 10,
                                        message: '请输入十字以上的简称规则'
                                    }],
                                    initialValue:readContent ? readContent.synopsis : ''
                                })(
                                    <TextArea autosize={{minRows: 2, maxRows: 6}} disabled={this.props.behavior === 'edit' ? false : !!readContent}/>
                                )}
                        </FormItem>
                    </Col>
                    {<Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="内部说明"
                        >
                            {getFieldDecorator('remark', {
                                rules: [{
                                    required: true,
                                    min: 10,
                                    message: '请输入十字以上的内部说明'
                                }],
                                initialValue:readContent ? readContent.remark : ''
                            })(
                                <TextArea autosize={{minRows: 6, maxRows: 10}} disabled={this.props.behavior === 'edit' ? false : !!readContent}/>
                            )}
                        </FormItem>
                    </Col>}
                </Row>
                {!!readContent && <Row>
                    <Col {...defaultSpan}>
                        <FormItem
                            {...formItemLayout}
                            label="创建时间"
                        >
                           {moment(readContent.createTime).format("YYYY-MM-DD HH:mm:ss")}
                        </FormItem>
                    </Col>
                </Row>}
            </div>
        )
    };
    onEffectiveSwitch = () => {

    }
    renderBaseRule = () => {
        const that = this;
        const {getFieldDecorator} = this.props.form;
        const {validityPeriodStatus, bookValidityPeriodStatus, cityFetching, cityData, express} = this.state;
        const {userList, channelList, houseTagList, readContent} = this.props;
        let couponUserLabels = [];
        let couponChannels = [];
        let couponHouseTag = [];
        let couponCity = [];
        if(readContent){
            couponHouseTag = readContent.houseSourceTagView
            couponCity = readContent.cityNamesView
            for (const i in readContent.couponUserLabels){
                couponUserLabels.push(readContent.couponUserLabels[i].id);
            }
            for (const i in readContent.couponChannels){
                couponChannels.push(readContent.couponChannels[i].id)
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
                                rules: [{
                                    required: true,
                                    message:'请选择用户标签'
                                }],
                                initialValue:readContent ? couponUserLabels : []
                            })(
                                <CheckboxGroup style={{marginTop:10}} disabled={!!readContent}>
                                <Row style={{width:'100%',display:'block'}}>
                                {userList.map(item=>{
                                    return <Col span={6} key={item.id}><Checkbox value={item.id}>{item.labelName}</Checkbox></Col>
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
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator('getLimit', {
                                        initialValue: readContent ? readContent.receiveLimitType : 1,
                                        rules: [{
                                            required: true
                                        }]
                                    })(
                                        <RadioGroup onChange={this.receiveLimit} disabled={!!readContent}>
                                            <Radio value={0}>无限制</Radio>
                                            <Radio value={1}>每人每日限领</Radio>
                                            <Radio value={2}>每人限领</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={3}>
                                <FormItem>
                                    {this.state.receiveLimit && getFieldDecorator('receiveLimit', {
                                    rules: [{
                                        required : true,
                                        type:'number',
                                        message:'请填写数字',
                                        min:1,
                                        transform: (value)=>{
                                            return Number(value);
                                        }
                                    }],
                                        initialValue: readContent ? readContent.receiveLimit : 1
                                    })(
                                        <Input
                                            addonAfter={'张'}
                                            disabled={!!readContent}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="预定有效期"
                        >
                            <Col span={7}>
                                <FormItem>
                                    {getFieldDecorator('bookPeriodType', {
                                        initialValue: readContent ? readContent.bookPeriodType : 1,
                                        rules: [{
                                            required: true,
                                            message: '请选择有效期'
                                        }]
                                    })(
                                        <RadioGroup onChange={this.selectBookValidityPeriod} disabled={!!readContent}>
                                            <Radio value={1}>绝对时间</Radio>
                                            <Radio value={2}>相对时间</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            {bookValidityPeriodStatus === 1 ? (
                                <Col span={17}>
                                    {getFieldDecorator('bookRangePicker', {
                                        rules: [{type: 'array', required: true, message: '请选择时间'}],
                                        initialValue:readContent ? [moment(readContent.bookStartTime), moment(readContent.bookEndTime)] : []
                                    })(<RangePicker disabled={!!readContent} format="YYYY-MM-DD" disabledDate={disabledDate}/>)
                                    }
                                </Col>
                            ) : (
                                <Col span={17}>
                                    <Col span={3}>
                                        <FormItem>
                                            {getFieldDecorator('bookAfterEffectiveDays', {
                                                initialValue: readContent ? readContent.bookAfterEffectiveDays : 0,
                                                rules: [{
                                                    required: true,
                                                    message: '请选择有效期'
                                                }]
                                            })(
                                                <InputNumber disabled={!!readContent} min={0} max={100000}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={4}>
                                        天后生效
                                    </Col>
                                    <Col span={5}>
                                        &nbsp;<Switch disabled={!!readContent} checkedChildren="生效天数:" unCheckedChildren="结束时间:" checked={this.state.isBookTimeDay} onChange={this.changeBookTimeDay} />
                                    </Col>
                                    {this.state.isBookTimeDay ? <Col span={8}>
                                        <FormItem>
                                            {getFieldDecorator('bookEffectiveDays', {
                                                initialValue: readContent ? readContent.bookEffectiveDays : 1,
                                                rules: [{
                                                    required: true,
                                                    message: '请选择有效期'
                                                }]
                                            })(
                                                <InputNumber disabled={!!readContent} min={1} max={100000}/>
                                            )}
                                        </FormItem>
                                    </Col> : <Col span={8}>
                                        <FormItem>
                                            {getFieldDecorator('bookEndTime', {
                                                initialValue: readContent && readContent.bookEndTime ? moment(readContent.bookEndTime) : undefined,
                                                rules: [{
                                                    required: true,
                                                    message: '请选择有结束时间'
                                                }]
                                            })(
                                                <DatePicker disabled={!!readContent} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    }
                                </Col>
                            )}
                            {/*<br/>*/}
                            {/*<Col span={17}>*/}
                            {/*<FormItem>*/}
                            {/*{getFieldDecorator('holidayLimit')(*/}
                            {/*<Checkbox>指定日期不可用,每逢周五、周六及法定节假日</Checkbox>*/}
                            {/*)}*/}
                            {/*</FormItem>*/}
                            {/*</Col>*/}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="入住有效期"
                        >
                            <Col span={7}>
                                <FormItem>
                                    {getFieldDecorator('validityPeriodType', {
                                        initialValue: readContent ? readContent.validityPeriodType : 1,
                                        rules: [{
                                            required: true,
                                            message: '请选择有效期'
                                        }]
                                    })(
                                        <RadioGroup onChange={this.selectValidityPeriod} disabled={!!readContent}>
                                            <Radio value={1}>绝对时间</Radio>
                                            <Radio value={2}>相对时间</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            {validityPeriodStatus === 1 ? (
                                <Col span={17}>
                                    {getFieldDecorator('rangePicker', {
                                        rules: [{type: 'array', required: true, message: '请选择时间'}],
                                        initialValue:readContent ? [moment(readContent.startTime), moment(readContent.endTime)] : []
                                    })(<RangePicker format="YYYY-MM-DD" disabledDate={disabledDate} disabled={!!readContent} />)
                                    }
                                </Col>
                            ) : (
                                <Col span={17}>
                                    <Col span={3}>
                                        <FormItem>
                                            {getFieldDecorator('effective', {
                                                initialValue: readContent ? readContent.afterEffectiveDays : 0,
                                                rules: [{
                                                    required: true,
                                                    message: '请选择有效期'
                                                }]
                                            })(
                                                <InputNumber min={0} max={100000} disabled={!!readContent} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={4}>
                                        天后生效
                                    </Col>
                                    <Col span={5}>
                                        &nbsp;<Switch disabled={!!readContent} checkedChildren="生效天数:" unCheckedChildren="结束时间:" checked={this.state.isTimeDay} onChange={this.changeTimeDay} />
                                    </Col>
                                    {this.state.isTimeDay ? <Col span={8}>
                                        <FormItem>
                                            {getFieldDecorator('day', {
                                                initialValue: readContent ? readContent.effectiveDays : 1,
                                                rules: [{
                                                    required: true,
                                                    message: '请选择有效期'
                                                }]
                                            })(
                                                <InputNumber min={1} max={100000} disabled={!!readContent} />
                                            )}
                                        </FormItem>
                                        </Col> : <Col span={8}>
                                            <FormItem>
                                                {getFieldDecorator('endTime', {
                                                    initialValue: readContent ? moment(readContent.endTime) : moment(),
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择有结束时间'
                                                    }]
                                                })(
                                                    <DatePicker disabled={!!readContent} />
                                                )}
                                            </FormItem>
                                        </Col>
                                    }
                                </Col>
                            )}
                            {/*<br/>*/}
                            {/*<Col span={17}>*/}
                                {/*<FormItem>*/}
                                    {/*{getFieldDecorator('holidayLimit')(*/}
                                        {/*<Checkbox>指定日期不可用,每逢周五、周六及法定节假日</Checkbox>*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="节假日可用"
                        >
                            <Col span={6}>
                                {getFieldDecorator('dateLimit', {
                                    initialValue: readContent ? readContent.dateLimit : 1,
                                    rules: [{
                                        required: true,
                                        message: '请选择节假日是否可用'
                                    }]
                                })(
                                    <RadioGroup>
                                        <Radio value={0}>可用</Radio>
                                        <Radio value={1}>不可用</Radio>
                                    </RadioGroup>
                                )}
                            </Col>
                            <Col span={4}>
                                <span
                                    onClick={function () {
                                        that.setState({festivalVisible: true})
                                }}
                                    style={{
                                    color: '#0066cc',
                                    cursor: 'pointer'
                                }}
                                >查看不可用日期</span>
                            </Col>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="使用限制"
                        >
                            {getFieldDecorator('useRestrictionType', {
                                initialValue: readContent ? readContent.useRestrictionType : 1,
                                rules:[{
                                    required:true,
                                    message:'请选择使用限制'
                                }]
                            })(
                                <RadioGroup disabled={!!readContent}>
                                    <Radio value={1}> 不可叠加使用，与其他优惠（会员折扣、优惠券等）排斥</Radio>
                                    <Radio value={2} disabled={express && express.costSharingType === 1}>不可叠加使用，但允许与会员折扣同时使用</Radio>
                                </RadioGroup>
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
                                    initialValue: readContent && readContent.nightsLimit === -1 ? -1 : 1
                                })(
                                    <RadioGroup onChange={this.nightsLimit} disabled={!!readContent}>
                                        <Radio value={1}>有限制</Radio>
                                        <Radio value={-1}>无限制</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        {this.state.nightsVisible &&
                        <Col span={8}>
                            <FormItem>
                                {getFieldDecorator('nights', {
                                    initialValue: readContent ? readContent.nightsLimit : 1,
                                    rules:[{
                                        required : true,
                                        type:'number',
                                        message:'请填写数字',
                                        transform: (value)=>{
                                            return Number(value);
                                        }
                                    }]
                                })(
                                    <Input
                                        addonBefore={'预定'}
                                        addonAfter={'个房晚方可使用'}
                                        disabled={!!readContent}
                                    />
                                )}
                            </FormItem>
                        </Col>}
                        {this.state.nightsVisible &&
                        <Col span={9}>
                            <FormItem>
                                {getFieldDecorator('workDays',{
                                    initialValue:readContent ? readContent.workDays : 1,
                                    rules:[{
                                        required : true,
                                        type:'number',
                                        message:'请填写数字',
                                        transform: (value)=>{
                                            return Number(value);
                                        }
                                    }]
                                })(<Input addonBefore={'且需包含'} addonAfter={'个工作日可用'} disabled={!!readContent} />)}
                            </FormItem>
                        </Col>}
                        {this.state.nightsVisible && <Col span={1}><Tooltip title={'工作日是指：周日至周四，不包括法定节假日'}><Icon type="question-circle"/></Tooltip></Col>}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem
                    {...formOverspeardLayout}
                    label="每人限制使用"
                    >
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('useCouponLimit', {
                                initialValue:readContent ? readContent.useCouponLimit : 0,
                                rules:[{
                                    required : true,
                                    type:'number',
                                    message:'请填写数字',
                                    transform: (value)=>{
                                        return Number(value);
                                    }
                                }]
                            })(
                                <Input
                                    addonAfter={'张'}
                                    disabled={!!readContent}
                                />
                            )}
                        </FormItem>
                    </Col>
                    </FormItem>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formOverspeardLayout}
                            label="适用渠道"
                        >
                            {getFieldDecorator('channelId',{
                                rules: [{
                                    required: true,
                                    message:'请选择渠道'
                                }],
                                initialValue:readContent ? couponChannels : []
                            })(
                                <CheckboxGroup style={{marginTop:10,width:"100%"}} disabled={!!readContent}>
                                    <Row>
                                    {channelList.map(item=>{
                                        return <Col span={6} key={item.id}><Checkbox value={item.id}>{item.channelName}</Checkbox></Col>
                                    })}
                                    </Row>
                                </CheckboxGroup>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {
                    houseTagList && houseTagList.map(tagItem => {
                        return (
                            <Row key={tagItem.categoryId}>
                                <Col>
                                    <FormItem
                                        {...formOverspeardLayout}
                                        label={tagItem.categoryName}
                                    >
                                        {getFieldDecorator('houseTagName',{
                                            initialValue:readContent ? couponHouseTag : []
                                        })(
                                            <CheckboxGroup style={{width:"100%"}}>
                                                <Row>
                                                    {tagItem.list.map(item=>{
                                                        return <Col span={6} key={item.id}><Checkbox value={item.id}>{item.name}</Checkbox></Col>
                                                    })}
                                                </Row>
                                            </CheckboxGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        )
                    })
                }

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
                                initialValue: readContent && couponCity !== null ? couponCity : []
                            })(
                                <Select
                                    mode="multiple"
                                    placeholder="选择城市"
                                    notFoundContent={cityFetching ? <Spin size="small" /> : null}
                                    filterOption={false}
                                    onSearch={this.fetchCity}
                                    onChange={this.handleChange}
                                    style={{ width: '100%' }}
                                >
                                    {cityData.map(d => <Option key={d.name}>{d.name}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }
    renderProcess = () => {
        const {getFieldDecorator} = this.props.form;
        const {auditListOne,auditListTwo,readContent} = this.props;
        return (
            <div>
                <Row>
                    <Col>
                        <h1 className="form-title">审核流程（一级为必要流程）</h1>
                    </Col>
                </Row>
                <Row>
                    <Col {...defaultSpan}>
                        <FormItem
                            {...formItemLayout}
                            label="一级审批人"
                        >
                            {getFieldDecorator('firstLevel', {
                                rules: [{
                                    required: true,
                                    message: '请选择一级审批人'
                                }],
                                initialValue:readContent && readContent.couponReviews && readContent.couponReviews[0] && readContent.couponReviews[0].reviewerId
                            })(
                                <Select>
                                    {auditListOne.map((item)=>{
                                        return <Option key={item.id} value={item.id}>{item.name}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...defaultSpan}>
                        <FormItem
                            {...formItemLayout}
                            label="二级审批人"
                        >
                            {getFieldDecorator('secondLevel',{
                                initialValue:readContent && readContent.couponReviews[1] ? readContent.couponReviews[1].reviewerId : ''
                            })(
                                <Select>
                                    {auditListTwo.map((item)=>{
                                        return <Option key={item.id} value={item.id}>{item.name}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }
    renderFooter () {
        let footerList = [<Button key="btn1" onClick={this.onCancel}>关闭</Button>]
        if(this.props.behavior === 'add' || this.props.behavior === 'edit'){
            footerList.push(<Button key="btn2" className="ant-btn-primary" onClick={this.onSubmit}>保存</Button>)
        }
        return footerList
    }
    render () {
        const {visible} = this.props;
        const { festivalVisible } = this.state;
        const that = this;
        let strName = ''
        if(this.props.behavior === 'add'){
            strName = '创建优惠券'
        }else if(this.props.behavior === 'edit'){
            strName = '修改优惠券'
        }else{
            strName = '查看优惠券'
        }

        const festivalColumns = [{
            title: '序号', dataIndex: 'length', key: 'length', width: 50, render: function (text, record, index) {
                return (
                    <span>{((that.tableThis.state.pageNum - 1) * 10) + index + 1}</span>
                )
            }
        }, {
            title: '名称',
            width: 100,
            dataIndex: 'holidayName',
            key: 'holidayName'
        }, {
            title: '城市',
            width: 100,
            dataIndex: 'cityNames',
            key: 'cityNames',
            render: (val) => {
                return (
                    <span>{val === '' ? '所有' : val}</span>
                )
            }
        }, {
            title: '日期',
            width: 100,
            dataIndex: 'startTime',
            key: 'startTime',
            render: (val, record) => {
                return (
                    <span>{dataFormat(val)}-{dataFormat(record.endTime)}</span>
                )
            }
        }, {
            title: '规则',
            width: 100,
            dataIndex: 'status',
            key: 'status',
            render: (val) => {
                return val === 1 ? <span style={{color: '#0066cc'}}>有效</span> : <span style={{color: 'red'}}>无效</span>;
            }
        }];

        const subTableItem = {
            getTableService: orderListService.getfestivalData,
            columns: festivalColumns,
            refsTab: function (ref) {
                that.tableThis = ref
            },
            antdTableProps: {
                bordered: true
            },
            isClosePagination: true,
            rowKey: "id"
        }

        return (
            <Fragment>
                <Modal
                    title={strName}
                    visible={visible}
                    footer={this.renderFooter()}
                    width="840px"
                    onCancel={this.onCancel}
                    wrapClassName="scroll-center-modal"
                    style={{top: 0}}
                    destroyOnClose
                >
                    <Form>
                        {this.renderBaseInfo()}
                        {this.renderBaseRule()}
                        {this.renderProcess()}
                    </Form>
                </Modal>
                <Modal
                    title="节假日是否可用日期"
                    width={750}
                    visible={festivalVisible}
                    className="hideModel-okBtn"
                    onCancel={function () {
                    that.setState({
                        festivalVisible: false
                    })
                }}
                >
                    <SubTable
                        {...subTableItem}
                    />
                </Modal>
            </Fragment>

        )
    }
}

OperateCouponModal.defaultProps = {
    behavior: '默认操作',
    couponDetail: null
}

OperateCouponModal.propTypes = {
    behavior: PropTypes.string,
    couponDetail: PropTypes.object,
    onCancel: PropTypes.func
}

OperateCouponModal = Form.create()(OperateCouponModal)

export default OperateCouponModal
