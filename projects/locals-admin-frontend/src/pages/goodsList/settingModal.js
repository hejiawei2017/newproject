import React, { Component } from 'react'
import {Input, Modal, Form, Checkbox, Select , Row, Col, Radio } from 'antd'
import PropTypes from 'prop-types'
import './index.less'
import {message} from "antd/lib/index"
import Global from '../../utils/Global.js'

const FormItem = Form.Item
const Option = Select.Option

const RadioGroup = Radio.Group

class SettingModal extends Component {
    static propTypes = {
        handleSettingSubmit: PropTypes.func,
        stateChange: PropTypes.func,
        formSettingParams: PropTypes.object,
        currentGoodsInfo: PropTypes.object,
        settingModalVisible: PropTypes.bool,
        settingType: PropTypes.string
    }

    constructor (props) {
        super(props)
        this.state = {
            formParams : props.formSettingParams,
            userInfo: Global.userInfo || {
                username: ''
            }
        }
        this.handleCancel = this.handleCancel.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        this.setState({
            formParams: nextProps.formSettingParams
        })
    }
    handleCancel () {
        this.props.stateChange({settingModalVisible: false})
    }
    onSelectValue = (value) => {
        let params = this.state.formParams
        params.calculate = Number(value)
        this.setState({
            formParams: params
        })
    }
    onChangeCheckboxLevelOne = (value) => {
        let params = this.state.formParams
        params.levelOne = value.target.checked
        params.levelOnePrice = value.target.checked ? this.state.formParams.levelOnePrice : 0
        this.setState({
            formParams: params
        })
    }
    onChangeCheckboxLevelTwo = (value) => {
        let params = this.state.formParams
        params.levelTwo = value.target.checked
        params.levelTwoPrice = value.target.checked ? this.state.formParams.levelTwoPrice : 0
        this.setState({
            formParams: params
        })
    }
    onChangeChannel = (e) => {
        let params = this.state.formParams;
        params.channel = e.target.value;
        this.setState({
            formParams: params
        })
    }

    onChangeWay = (e) => {
        let params = this.state.formParams;
        params.way = e.target.value;
        this.setState({
            formParams: params
        })
    }
    render () {
        let that = this;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        }
        const formSelectLayout = {
            wrapperCol: {
                xs: { span: 8 },
                sm: { span: 6 }
            }
        }

        return (
            <Modal
                width={980}
                visible={this.props.settingModalVisible}
                title={this.props.settingType === 'profits' ? '利润分成设置' : '个性化配置'}
                onOk={ function () {
                    that.props.form.validateFields((err, values) => {
                        if (!err) {
                            let data = JSON.parse(JSON.stringify(that.state.formParams));
                            if(that.props.settingType === 'profits') {
                                let profitsAmount = (Number(that.props.currentGoodsInfo.retailPrice) - Number(that.props.currentGoodsInfo.supplierPrice)).toFixed(2)
                                let dividedAmount = (Number(values.levelOnePrice)).toFixed(2)
                                //当选择二级分成时，相加分成利润进行下一步判断
                                if(values.levelTwo){
                                    dividedAmount = (Number(dividedAmount) + Number(values.levelTwoPrice)).toFixed(2)
                                }

                                if(data.calculate === 1 && (Number(profitsAmount) < dividedAmount)) {
                                    message.warning('分成金额不可大于商品商品利润价格！')
                                    return
                                }
                                if(data.calculate === 2 && dividedAmount > 100 ){
                                    message.warning('分成比例总和不可大于100%！')
                                    return
                                }

                                data.calculate = values.calculate
                                data.levelOne = values.levelOne ? '1' : ''
                                data.levelOnePrice = values.levelOnePrice
                                data.levelTwo = values.levelTwo ? '1' : ''
                                data.levelTwoPrice = values.levelTwoPrice
                            }else{
                                data.channel = values.channel;
                                data.way = values.way;
                                if(Number(values.stickType) === 0) {
                                    data.stickType = null;
                                }else {
                                    data.stickType = values.stickType;
                                }
                                data.levelTwo = that.state.formParams.levelTwo ? '1' : ''
                                data.levelOne = that.state.formParams.levelOne ? '1' : ''
                            }
                            data['updator'] = that.state.userInfo.username
                            that.props.handleSettingSubmit(data)
                        }
                    })
                }}
                onCancel={this.handleCancel}
                cancelText="关闭"
                okText="保存"
            >
                {
                    this.props.settingType === 'profits' ? (
                        <Form>
                            <div className="profits-wrapper">
                                <p className="profits-describe">实际售价：{this.props.currentGoodsInfo.retailPrice} 元 供应价：{this.props.currentGoodsInfo.supplierPrice} 元</p>
                                <p className="profits-describe">利润分成配置（优先级说明：先计算助理房东/BU /路客的固定分成收入，剩余收入再计算房东利润分成）</p>
                                <FormItem {...formSelectLayout}>
                                    {getFieldDecorator('calculate', {
                                        initialValue: this.state.formParams.calculate,
                                        rules: [{ required: true, message: '请选择分成计算方式' }]
                                    })(
                                        <Select className="select" onSelect={this.onSelectValue}>
                                            <Option value="">请选择</Option>
                                            <Option value={2}>按比例计算</Option>
                                            <Option value={1}>按固定金额</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <div className="setting-title">
                                    <span>一级分成{this.state.formParams.levelOne}：</span>
                                </div>
                                <Row>
                                    <Col span={8}>
                                        <div className="setting-item-wrapper">
                                            <div className="setting-item-left">
                                                <FormItem
                                                    {...formItemLayout}
                                                >
                                                    {getFieldDecorator('levelOne', {
                                                        initialValue: this.state.formParams.levelOne,
                                                        rules:
                                                            [
                                                                { validator (rule, value, callback) {
                                                                    console.log(value)
                                                                    if(!value){
                                                                        callback('必选')
                                                                        return
                                                                    }else{
                                                                        callback()
                                                                    }
                                                                }}
                                                            ]
                                                    })(
                                                        <Checkbox checked={this.state.formParams.levelOne} onChange={this.onChangeCheckboxLevelOne} />
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div className="setting-item-right">
                                                <FormItem
                                                    {...formItemLayout}
                                                >
                                                    {getFieldDecorator('levelOnePrice', {
                                                        initialValue: this.state.formParams.levelOnePrice,
                                                        rules:
                                                            [
                                                                { required: true, message: '分成不能为空' },
                                                                { validator (rule, value, callback) {
                                                                    if(value === ''){
                                                                        callback()
                                                                        return
                                                                    }else if(value.length > 8) {
                                                                        callback('价格不可大于8位数');
                                                                    }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                                                        callback('价格输入有误');
                                                                    }else{
                                                                        callback()
                                                                    }
                                                                }}
                                                            ]
                                                    })(
                                                        <Input disabled={!this.state.formParams.levelOne}
                                                            type="number"
                                                            placeholder="请输入"
                                                            addonBefore="路客"
                                                            addonAfter={this.state.formParams.calculate === 1 ? '元' : (this.state.formParams.calculate === 2 ? '%' : '')}
                                                        />
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                    </Col>
                                    {
                                        //TODO 后续需要支持多选 房东助理利润分成与BU利润分成
                                    }
                                </Row>
                                <hr />
                                <div className="setting-title">
                                    <span>二级分成：</span>
                                </div>
                                <Row>
                                    <Col span={8}>
                                        <div className="setting-item-wrapper">
                                            <div className="setting-item-left">
                                                <FormItem
                                                    {...formItemLayout}
                                                >
                                                    {getFieldDecorator('levelTwo', {
                                                        initialValue: this.state.formParams.levelTwo,
                                                        rules:
                                                            [
                                                                { validator (rule, value, callback) {
                                                                    console.log(value)
                                                                    if(!value){
                                                                        callback('必选')
                                                                        return
                                                                    }else{
                                                                        callback()
                                                                    }
                                                                }}
                                                            ]
                                                    })(
                                                        <Checkbox checked={this.state.formParams.levelTwo} onChange={this.onChangeCheckboxLevelTwo} />
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div className="setting-item-right">
                                                <FormItem
                                                    {...formItemLayout}
                                                >
                                                    {getFieldDecorator('levelTwoPrice', {
                                                        initialValue: this.state.formParams.levelTwoPrice,
                                                        rules:
                                                            [
                                                                { required: true, message: '分成不能为空' },
                                                                { validator (rule, value, callback) {
                                                                    if(value === ''){
                                                                        callback()
                                                                        return
                                                                    }else if(value.length > 8) {
                                                                        callback('价格不可大于8位数');
                                                                    }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                                                        callback('价格输入有误');
                                                                    }else{
                                                                        callback()
                                                                    }
                                                                }}
                                                            ]
                                                    })(
                                                        <Input disabled={!this.state.formParams.levelTwo}
                                                            type="number"
                                                            placeholder="请输入"
                                                            addonBefore="房东"
                                                            addonAfter={this.state.formParams.calculate === 1 ? '元' : (this.state.formParams.calculate === 2 ? '%' : '')}
                                                        />
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Form>) : null
                }
                {
                    this.props.settingType === 'personalized' ?
                        (
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="分销渠道/平台"
                                >
                                    {getFieldDecorator('channel', {
                                        initialValue: this.state.formParams.channel
                                    })(
                                        <RadioGroup onChange={this.onChangeChannel}>
                                            <Radio value={1}>扫码购</Radio>
                                            <Radio value={2}>新零售小程序</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="分销方式"
                                >
                                    {getFieldDecorator('way', {
                                        initialValue: this.state.formParams.way
                                    })(
                                        <RadioGroup onChange={this.onChangeWay}>
                                            <Radio value={2}>快递邮寄</Radio>
                                            <Radio value={1}>现场使用</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Form>
                        ) : null
                }
            </Modal>
        )
    }
}
SettingModal = Form.create()(SettingModal)
export default SettingModal
