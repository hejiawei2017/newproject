import React, { Component } from 'react'
import {Modal, Form, InputNumber,Input, DatePicker, message,Spin} from 'antd'
import {connect} from "react-redux";
import moment from 'moment';
import { houseCheckingService } from '../../services'
import './setModal.less'
import { sourseType } from 'utils/dictionary'

const Search = Input.Search;
const FormItem = Form.Item

@connect(state => ({
    currentOrder: state.order.currentOrder,
}))
class SetFormModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            newCheckin: 0,
            newCheckout: 0,
            changeName: '',
            haveHouse: true,
            searching: false,
            isSearch: false,
            houseSourceId: ''
        }
    }
    componentDidMount () {
        const { currentOrder } = this.props
        this.setState({
            newCheckin: moment(currentOrder.checkinDate),
            newCheckout: moment(currentOrder.checkoutDate)
        })
    }
    handleCancel = () => {
        this.changeHouseId()
        this.props.stateChange({isShowSetOrder: false})
    }
    onModalOk = (e) => {
        e.preventDefault()
        const { currentOrder } = this.props
        this.props.form.validateFields((err, values) => {
            if(values.houseNoName){
                if(!this.state.isSearch){
                    message.error('如需更换房源，请查询房源是否存在！');
                    return
                }
                values.houseSourceId = this.state.houseSourceId
            }
            if(!values.checkinDate !== !values.checkoutDate){
                message.error('请检查入住和离店时间！');
                return
            }
            if(values.checkinDate && values.checkoutDate){
                if(moment(values.checkinDate).format('YYYY-MM-DD') === moment(values.checkoutDate).format('YYYY-MM-DD')){
                    message.error('入住时间和离店时间不能相同!');
                    return
                }
            }
            if(moment(values.checkinDate).format('YYYY-MM-DD') === moment(currentOrder.checkinDate).format('YYYY-MM-DD') && moment(values.checkoutDate).format('YYYY-MM-DD') === moment(currentOrder.checkoutDate).format('YYYY-MM-DD')){
                message.error('新入住时间和离店时间不能和原入住离店时间相同!');
                return
            }
            if (err) {
                return
            }else{
                this.props.onSubmit(values)
            }
        })
    }
    disabledDate = (current) => {
        return current < moment().startOf('day')
    }
    checkinFn = (data) => {
        const time = moment(data).set('hour', 14);
        this.setState({
            newCheckin: time
        })
    }
    checkoutFn = (data) => {
        if(data < this.state.newCheckin) {
            message.error('离店日期不能小于入住日期');
            return
        }
        const time = moment(data).set('hour', 12);
        this.setState({
            newCheckout: time
        })
    }
    changeHouseId = () => {
        this.setState({
            changeName: '',
            haveHouse: true,
            searching: false,
            isSearch: false
        })
    }
    houseSearch = (id) =>{
        if(id === '') {
            message.error('未填入房源编号！');
            this.changeHouseId()
            return
        }
        this.setState({
            searching:true
        })
        const params = {
            houseNo: id,
            pageNum: 1,
            pageSize: 10,
            houseStatusIn: '5,7,8'
        }
        houseCheckingService.getTable(params).then((data) => {
            const list = data.list
            if(list.length === 0){
                this.setState({
                    searching:false,
                    haveHouse: false,
                    changeName: '无此房源'
                })
                message.error('未查询到此房源');
            }else{
                this.setState({
                    searching:false,
                    haveHouse: true,
                    isSearch: true,
                    houseSourceId: list[0].houseSourceId,
                    changeName: `房源标题：${list[0].title}`
                })
            }
        }).catch(e => {
            this.setState({
                searching:false
            })
            message.error('查询房源失败');
        })
    }
    transSourceStr = (source, sourceRemark) => {
        if(source === 'OTHER') {
            return '其他-' + sourceRemark
        }else if(source === 'LONG_TERM') {
            return '长租-' + sourceRemark
        }else{
            return sourseType[source] || source
        }
    }
    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 }
            }
        }
        const { getFieldDecorator } = this.props.form
        const { currentOrder } = this.props
        const { checkinDate, checkoutDate, orderCostDetailView,houseNo,amount,source,sourceRemark,orderHouseView } = currentOrder
        const { transferPrice } = orderCostDetailView
        const { newCheckin,newCheckout,changeName,haveHouse,searching } = this.state
        const isOwnPlatform = ['APP', 'MP', 'MINI_PROGRAM', 'H5', 'WEB', 'NEW_MINI_PROGRAM'].includes(source) // 订单来源是否是自有平台
        return (
            <Modal
                title={`修改${this.transSourceStr(source,sourceRemark)}订单`}
                visible
                width={800}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="入住房源"
                    >
                        <p>{houseNo}</p>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="房源名称"
                    >
                        <p>{orderHouseView.title}</p>
                    </FormItem>
                    {/* <FormItem
                        {...formItemLayout}
                        label="更换房源"
                    >
                        {getFieldDecorator('houseNoName', {
                            rules: [{ required: false, message: '房源编号' }]
                        })(
                            <Search enterButton onSearch={this.houseSearch} onChange={this.changeHouseId} />
                        )}
                        {searching ? (
                            <Spin />
                        ) : (
                            <div>
                                {changeName !== '' &&
                                    <p className={`lh16 ${!haveHouse ? 'ant-span-red' : ''}`}>{changeName}</p>
                                }
                            </div>
                        )}
                    </FormItem> */}
                    <FormItem
                        {...formItemLayout}
                        label="入住日期"
                    >
                        <p>{moment(checkinDate).format('YYYY-MM-DD')}</p>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="离店日期"
                    >
                        <p>{moment(checkoutDate).format('YYYY-MM-DD')}</p>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="入住天数"
                    >
                        <p>{Math.ceil((moment(checkoutDate) - moment(checkinDate)) / 86400000)}</p>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="新入住日期"
                    >
                        {getFieldDecorator('checkinDate', {
                            rules: [{ required: false, message: '入住日期不能为空' }]
                        })(
                            <DatePicker format="YYYY-MM-DD" onChange={this.checkinFn} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="新离店日期"
                    >
                        {getFieldDecorator('checkoutDate', {
                            rules: [{ required: false, message: '离店日期不能为空' }]
                        })(
                            <DatePicker format="YYYY-MM-DD" onChange={this.checkoutFn} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="新入住天数"
                    >
                        {Math.ceil((newCheckout - newCheckin) / 86400000) > 0 ? (
                            <p>{Math.ceil((newCheckout - newCheckin) / 86400000)}</p>
                        ) : (
                            <p className="ant-span-red">离店日期不能小于入住日期</p>
                        )}
                    </FormItem>
                    {!isOwnPlatform &&
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label="原金额"
                            >
                                <p>{amount}</p>
                                <div className="lh16">修改返款给房东金额（非自有渠道订单）</div>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="金额"
                            >
                                {getFieldDecorator('amount', {
                                    rules:
                                        [
                                            { required: false, message: '价格不能为空' },
                                            { validator (rule, value, callback) {
                                                    if(value == null){
                                                        callback()
                                                        return
                                                    }else if(value.length > 8) {
                                                        callback('价格不可大于8位数');
                                                    }else if(value > amount) {
                                                        callback('价格不能大于原金额');
                                                    }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                                        callback('价格输入有误');
                                                    }else{
                                                        callback()
                                                    }
                                                }}
                                        ]
                                })(
                                    <InputNumber precision = {2}/>
                                )}
                                <div className="ant-span-red lh16">（返款给房东的金额为的订单总价扣掉佣金）</div>
                            </FormItem>
                        </div>
                    }
                </Form>
            </Modal>
        )
    }
}

const SetModal = Form.create()(SetFormModal)
export default SetModal
