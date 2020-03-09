import React, {Component} from 'react'
import { Form, Input,Button, Select, Checkbox, Row, Col} from 'antd'
import { houseMaintainService } from '../../services'
import { currencyTypeList } from '../../utils/dictionary'
import {message} from "antd/lib/index";

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
class HousePrices extends Component {
    constructor () {
        super()
        this.state = {
            isRepeat: false,
            houseInfo: {},
            housePriceInfo: {},
            defaultActivities: []
        }
    }
    componentDidMount () {
        //获取房屋价格信息
        this.getHousePriceInfo()
        this.getHouseInfo()
    }
    getHousePriceInfo = () => {
        houseMaintainService.fetchHousePriceInfo(this.props.houseSourceId).then((res) => {
            //获取默认已经选中的活动
            let defaultActivities = []
            if(!!res.activities) {
                res.activities.forEach(item => {
                    if(item.activityStatus === 1) {
                        defaultActivities.push(item.activityCode)
                    }
                })
            }
            this.setState({
                housePriceInfo: res,
                defaultActivities
            })
        })
    }
    getHouseInfo = () => {
        houseMaintainService.fetchHouseRoom(this.props.houseSourceId).then((res) => {
            this.setState({
                houseInfo: res
            })
        })
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = values
                if(this.state.houseInfo.bedNumber === 0) {
                    message.warning('请先在房屋信息栏设置床位个数，再设置价格');
                    return
                }else {
                    if(Number(params.standardPrice) > (1500 * this.state.houseInfo.bedNumber)) {
                        message.warning('平日价格不可大于房屋床位个数乘以1500');
                        return ;
                    }
                    if(Number(params.weekPrice) > (1500 * this.state.houseInfo.bedNumber)) {
                        message.warning('周末价格不可大于房屋床位个数乘以1500');
                        return ;
                    }
                }

                let activitiesList = []
                if(params.activities.length > 0) {
                    params.activities.forEach(itemId => {
                        this.state.housePriceInfo.activities.forEach(item => {
                            if(itemId === item.activityCode) {
                                //把选中的状态改成1传到后端
                                item.activityStatus = 1
                                activitiesList.push(JSON.parse(JSON.stringify(item)))
                            }else{
                                item.activityStatus = 0
                                activitiesList.push(JSON.parse(JSON.stringify(item)))
                            }
                        })
                    })
                }else{
                    this.state.housePriceInfo.activities.forEach(item => {
                        item.activityStatus = 0
                        activitiesList.push(JSON.parse(JSON.stringify(item)))
                    })
                }
                //重新复制给活动数组字段
                params.activities = activitiesList
                this.setState({isRepeat: true})
                houseMaintainService.updateHousePriceInfo(this.props.houseSourceId, params).then(res => {
                    message.success('更新成功');
                    this.setState({isRepeat: false}, () => {
                        this.props.nextCb();
                    })
                }).catch(err => {
                    this.setState({isRepeat: false})
                })
            }
        })
    }

    render () {
        const { getFieldDecorator } = this.props.form
        const { housePriceInfo, defaultActivities, isRepeat } = this.state

        return (
            <div className="house-maintain">
                <Form>
                    <FormItem
                        label="币种"
                    >
                        {getFieldDecorator('currency', {
                            initialValue: housePriceInfo.currency || 'CNY',
                            rules: [{ required: true, message: '请选择币种' }]
                        })(
                            <Select placeholder="请选择币种" disabled>
                                {
                                    currencyTypeList.map((item, index) => {
                                        return <Option key={index} value={item.value}>{item.label}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        colon={false}
                        label={<span>日常价：<span style={{color: 'red'}}>（日常价不能少于100元）</span></span>}
                    >
                        {getFieldDecorator('standardPrice', {
                            initialValue: housePriceInfo.standardPrice,
                            rules: [
                                { required: true, message: '日常价不能为空' },
                                { validator (rule, value, callback) {
                                    if(value == null || value === ''){
                                        callback()
                                        return
                                    }else if(value.length > 8) {
                                        callback('价格不可大于8位数');
                                    }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                        callback('价格输入有误');
                                    }else if(((Number(value) * 100) / 100) < 100){
                                        callback('日常价不能少于100元');
                                    }else{
                                        callback()
                                    }
                                }}
                            ]
                        })(
                            <Input placeholder="请输入日常价" />
                        )}
                    </FormItem>
                    <FormItem
                        colon={false}
                        label={<span>周末价：<span style={{color: 'red'}}>（周末价不能少于100元）</span></span>}
                    >
                        {getFieldDecorator('weekPrice', {
                            initialValue: housePriceInfo.weekPrice,
                            rules: [
                                { required: true, message: '周末价不能为空' },
                                { validator (rule, value, callback) {
                                    if(value == null || value === ''){
                                        callback()
                                        return
                                    }else if(value.length > 8) {
                                        callback('价格不可大于8位数');
                                    }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                        callback('价格输入有误');
                                    }else if(((Number(value) * 100) / 100) < 100){
                                        callback('周末价不能少于100元');
                                    }else{
                                        callback()
                                    }
                                }}
                            ]
                        })(
                            <Input placeholder="请输入周末价" />
                        )}
                    </FormItem>
                    <FormItem
                        colon={false}
                        label={<span>清洁费：<span style={{color: 'red'}}>（airbnb规定：35元&lt;清洁费&lt;4218元）</span></span>}
                    >
                        {getFieldDecorator('clearPrice', {
                            initialValue: housePriceInfo.clearPrice,
                            rules: [
                                { required: true, message: '清洁费不能为空' },
                                { validator (rule, value, callback) {
                                        if(value == null || value === ''){
                                            callback()
                                            return
                                        }else if(value.length > 8) {
                                            callback('价格不可大于8位数');
                                        }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                            callback('价格输入有误');
                                        }else if(35 > ((Number(value) * 100) / 100) || ((Number(value) * 100) / 100) > 4218){
                                            callback('airbnb规定：35元<清洁费<4218元');
                                        }else{
                                            callback()
                                        }
                                    }}
                            ]
                        })(
                            <Input placeholder="请输入清洁费" />
                        )}
                    </FormItem>
                    <FormItem
                        label="保证金"
                    >
                        {getFieldDecorator('deposit', {
                            initialValue: housePriceInfo.deposit,
                            rules: [
                                { validator (rule, value, callback) {
                                        if(value == null || value === ''){
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
                            <Input placeholder="请输入保证金" />
                        )}
                    </FormItem>
                    <FormItem
                        label="活动设置"
                    >
                        {getFieldDecorator('activities', {
                            initialValue: defaultActivities
                        })(
                            <CheckboxGroup style={{width: '100%'}}>
                                <Row>
                                    {
                                        housePriceInfo.activities && housePriceInfo.activities.map(item => {
                                            return (
                                                <Col span={8} key={item.activityCode}>
                                                    <Checkbox value={item.activityCode} >{item.activityName}</Checkbox>
                                                </Col>
                                            )
                                        })
                                    }

                                </Row>
                            </CheckboxGroup>
                        )}
                    </FormItem>
                </Form>
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e8e8e8',
                        padding: '10px 16px',
                        textAlign: 'right',
                        left: 0,
                        background: '#fff',
                        borderRadius: '0 0 4px 4px'
                    }}
                >
                    <Button
                        style={{
                            marginRight: 8
                        }}
                        onClick={this.props.onCloseDrawer}
                    >
                        取消
                    </Button>
                    <Button type="primary" loading={isRepeat} onClick={this.handleSubmit}>
                        保存并下一步
                    </Button>
                </div>
            </div>
        )
    }
}

HousePrices = Form.create()(HousePrices)
export default HousePrices
