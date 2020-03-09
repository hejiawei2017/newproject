import React, { Component } from 'react'
import moment from 'moment'
import { connect } from "react-redux"
import { Modal, Form, DatePicker, message } from 'antd'
import * as API from 'services'
import {orderService} from '../../services'
import {
    getOrderDetail
} from '../../actions/order'
import './abnormalOrderModal.less'
const Fragment = React.Fragment
const FormItem = Form.Item

const tailFormItemLayout = {
    labelCol: {
        xs: { span: 22 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 14 }
    }
}

@connect(state => ({
    currentOrder: state.order.currentOrder
}))
@Form.create()
export default class ChangeDateModal extends Component {
    constructor (props) {
        super(props)
        this.handleCancel = this.handleCancel.bind(this)
        this.doOk = this.doOk.bind(this)
    }

    state = {
        bookingId: 0,
        checkinDate: "",
        checkoutDate: "",
        confirmVisible: false
    }

    handleCompensation = values => {
        API.orderService.changeDate(values)
            .then(() => {
                this.showAfterConfirm()
            })
    }

    showAfterConfirm = () => {
        const modal = Modal.success({
            title: '修改时间成功～',
            onOk: () => {
                this.handleCancel(true)
                modal.destroy()
            }
        })
    }

    handleCancel = (needRequest) => {
        const { dispatch, currentOrder } = this.props

        if (needRequest) {
            dispatch(getOrderDetail(currentOrder.bookingId)).then(() => {
                this.props.toggleChangeDateModal()
                this.props.form.resetFields()
            })
        } else {
            this.props.toggleChangeDateModal()
            this.props.form.resetFields()
        }
    }

    renderRefundComFromMode = () => {
        return this.renderRefundableCom()
    }

    validateRefundValue = (key, val) => {
        const { orderCostDetailView} = this.props.currentOrder
        let clearPrice = (orderCostDetailView && orderCostDetailView.clearPrice) || '0'
        let invoiceServicePrice = (orderCostDetailView && orderCostDetailView.invoiceServicePrice) || '0'
        let shouldReturnCashPrice = (orderCostDetailView && orderCostDetailView.shouldReturnCashPrice) || '0'
        let shouldReturnRoomPrice = orderCostDetailView && orderCostDetailView.shouldReturnRoomPrice || '0'
        let maxReundValueMap = {
            clearPrice,
            invoiceServicePrice,
            cashPrice: shouldReturnCashPrice,
            roomPrice: shouldReturnRoomPrice
        }
        if ((val || 0) > maxReundValueMap[key] ) {
            return false
        }
        return true
    }

    handleOk = e => {
        e.preventDefault()
        this.doOk()
    }

    doOk (){
        this.setState({confirmVisible:true})
        const currentOrder = this.props.currentOrder
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values['bookingId'] = currentOrder.bookingId
                values['checkinDate'] = values['checkinDate'].format('YYYY-MM-DD')
                values['checkoutDate'] = values['checkoutDate'].format('YYYY-MM-DD')
                if(values['checkinDate'] > values['checkoutDate']){
                    message.error('结束时间必须大于开始时间！')
                    return false
                }
                this.setState({
                    bookingId: values['bookingId'],
                    checkinDate : values['checkinDate'],
                    checkoutDate : values['checkoutDate']
                },()=>this.handleCompensation(values))
            }
            setTimeout(()=>{
                this.setState({confirmVisible:false})
            },2000)
        })
    }
    onChangeDate = (fun) => {
        let houseSourceId = this.props.currentOrder.houseSourceId;
        this.props.form.validateFields((err, values) => {
            let param = {
                checkinDate: values['checkinDate'].format('YYYY-MM-DD'),
                checkoutDate: values['checkoutDate'].format('YYYY-MM-DD')
            }
            if(param.checkoutDate <= param.checkinDate){
                message.error('结束时间必须大于开始时间！')
                return false
            }
            orderService.checkOrderDate(houseSourceId,param).then((data) => {
                if(!data){
                    message.error('请检查日期已经被占用，请另选时间！')
                    return false
                }else{
                    if(fun){
                        fun()
                    }else{
                        message.success('可以选择！')
                    }
                }
            }).catch(()=>{
                return false
            })
        })
    }
    renderRefundableCom = () => {
        const { checkinDate, checkoutDate } = this.props.currentOrder
        const { getFieldDecorator } = this.props.form
        // 入住前可以修改时间
        /**
         * 订单状态：待入住 入住中 允许客人提前取消订单
         * 订单状态：入住中 允许客人提前离店
         * 其他订单状态不显示
        */
        return (
            <div>
                     {
                        <FormItem
                            { ...tailFormItemLayout}
                            label={'入住时间'}
                        >
                        {

                            <Fragment>
                                {getFieldDecorator('checkinDate', {
                                    rules: [{ required: true, message: '请输入入住时间！' }],
                                    initialValue: moment(checkinDate) })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD"
                                    />
                                )}
                            </Fragment>

                        }
                        </FormItem>
                    }
                    {
                        <FormItem
                            { ...tailFormItemLayout}
                            label={'离店时间'}
                        >
                        {

                            <Fragment>
                                {getFieldDecorator('checkoutDate', {
                                    rules: [{ required: true, message: '请输入离店时间！' }],
                                    initialValue: moment(checkoutDate) })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD"
                                    />
                                )}
                            </Fragment>

                        }
                    </FormItem>
                    }
                </div>
        )

    }

    render = () => {
        const { visible } = this.props
        const self = this
        return (
            <Modal
                width={500}
                title={'修改订单时间'}
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={this.state.confirmVisible}
                onCancel={function () {
                    self.handleCancel(false)
                }}
            >
                <Form layout="inline">
                    {this.renderRefundComFromMode()}
                </Form>
            </Modal>
        )
    }
}