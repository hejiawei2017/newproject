import React, { Component } from 'react'
import moment from 'moment'
import { connect } from "react-redux"
import { Modal, Form, Radio, InputNumber, DatePicker, message } from 'antd'
import * as API from 'services'
import {
    getOrderDetail
} from '../../actions/order'
import './abnormalOrderModal.less'
import { debounce } from 'utils/utils'
const Fragment = React.Fragment
const FormItem = Form.Item
const RadioGroup = Radio.Group
const confirm = Modal.confirm
const formItemLayout = {

}
const tailFormItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24}
    }
}

let cancelTypeOptions = [
    { label: '客人提前取消订单', value: '7', key: '7' },
    { label: '客人提前离店', value: '8', key: '8' }
]

const orderStatusMapper = {
    '1207': '7', // 待入住映射 cancelTypeOptions 的 value 为 7
    '1208': '8'
}

@connect(state => ({
    currentOrder: state.order.currentOrder
}))
@Form.create()
export default class DepositModal extends Component {

    constructor () {
        super();
        this.getRecommendationRefund = debounce(this.getRecommendationRefund, 500)
    }
    state = {
        cancelType: '7',
        realCheckoutDate: "",
        customorPriceDetail: {
            customorInvoiceServicePrice: 0,
            customorTotalPrice: 0,
            customorCashPrice: 0,
            customorRoomPrice: 0,
            customorPrice: 0
        } // 推荐价格详情
    }
    componentWillReceiveProps = (nextProps) => {
        let currentOrderStatus = nextProps.currentOrder && nextProps.currentOrder.orderStatus
        let prevOrderStatus = this.props.currentOrder && this.props.currentOrder.orderStatus

        if (prevOrderStatus !== currentOrderStatus) {
            this.setState({
                cancelType: orderStatusMapper[currentOrderStatus]
            })
        }
    }
    doPreConfirm (values,currentOrder){
        this.showPreConfirm(() => {
            try {
                fundebug.notify("orderRefund",{randomId:currentOrder.randomId,...values})// eslint-disable-line no-undef
            } catch (error) {
                console.log({randomId:currentOrder.randomId,...values})
            }
            this.handleCompensation(values)
        })
    }
    handleOk = e => {
        e.preventDefault()
        const { isEdit } = this.props
        const currentOrder = this.props.currentOrder

        if (isEdit) {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    values['orderNo'] = currentOrder.bookingId
                    values['cancelType'] = this.state.cancelType
                    values['orderRefundDetailViews'] = this.handleOrderRefundDetail(values)
                    if (this.state.cancelType === '8') {
                        if(values['realCheckoutDate'] === "")return
                        values['realCheckoutDate'] = values['realCheckoutDate'].format('YYYY-MM-DD HH:mm:ss')
                        this.setState({realCheckoutDate : values['realCheckoutDate']},()=>this.doPreConfirm(values,currentOrder))
                    }else{
                        this.setState({realCheckoutDate : ""},() => this.doPreConfirm(values,currentOrder))
                    }
                }
            })
        } else {
            this.handleCancel(false)
        }

    }

    handleOrderRefundDetail = payload => {
        let orderRefundDetailViews = []
        let map = {
            'clearPrice': '1',
            // 'booking_fare': '3',
            'invoiceServicePrice': '4',
            'roomPrice': '2',
            'cashPrice': '8'
        }

        for (let [key, val] of Object.entries(payload)) {
            if (key === 'roomPrice' || key === 'clearPrice' || key === 'invoiceServicePrice' || key === 'cashPrice') {
                orderRefundDetailViews.push({
                    refundItemType: map[key],
                    refundPrice: val || 0
                })
                // 删除在 payload 中对应的 key
                delete payload[key]
            }
        }

        return orderRefundDetailViews
    }

    showPreConfirm = (okCb, cancelCb) => {
        let msg = this.state.realCheckoutDate !== "" ? `提醒：你的退款时间设置为${this.state.realCheckoutDate}` : `提醒：退款时间为默认`
        confirm({
            centered: true,
            title: `继续前请务必确认退款项与所对应的退款金额无误，以免造成损失~ ${msg}`,
            onOk: () => {
                okCb && okCb()
            },
            onCancel: () => {
                cancelCb && cancelCb()
            }
        })
    }

    handleCompensation = payload => {
        API.orderService.cancelOrder(payload)
            .then(() => {
                this.showAfterConfirm()
            })
            //.catch(err => message.error(err))
    }

    showAfterConfirm = () => {
        const modal = Modal.success({
            title: '退款操作已完成~请及时反馈给客户~',
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
                this.props.toggleAbnormalOrderModal()
                this.props.form.resetFields()
            })
        } else {
            this.props.toggleAbnormalOrderModal()
            this.props.form.resetFields()
        }
    }

    switchcancelType = e => {
        this.setState({
            cancelType: e.target.value
        })
    }


    renderRefundComFromMode = () => {
        const { isEdit } = this.props
        if (!isEdit)
            return this.renderRefundedCom()
        else
            return this.renderRefundableCom()
    }

    renderRefundedCom = () => {
        const { cancelType, customorPriceDetail } = this.state
        const { orderRefundView, bookingDay, orderCostDetailView } = this.props.currentOrder
        const refundViewList = (orderRefundView && orderRefundView.refundViewList) ? orderRefundView.refundViewList : []
        const clearingRefund = refundViewList.find(item => item.refundItemType === '1')
        // const bookingRefund = refundViewList.find(item => item.refundItemType === '3')
        const invoiceRefund = refundViewList.find(item => item.refundItemType === '4')
        const partialHomeRefund = refundViewList.find(item => item.refundItemType === '2')
        const wholeHomeRefund = refundViewList.find(item => item.refundItemType === '6')
        //const cashRefund = refundViewList.find(item => item.refundItemType === '8')

        return (
            <Fragment>
                <div className="abnormal-order-cover">
                    <FormItem
                        {...formItemLayout}
                        label={'清洁费·退还金额'}
                    >
                        {
                            <span className="ant-form-text">{clearingRefund && clearingRefund.refundPrice} 元</span>

                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={'发票服务费·退还金额'}
                    >
                        {
                            <span className="ant-form-text">{invoiceRefund && invoiceRefund.refundPrice} 元</span>
                        }
                    </FormItem>
                    {/* <FormItem
                        {...formItemLayout}
                        label={'消费金·退还金额'}
                    >
                        {
                            <span className="ant-form-text">{cashRefund && cashRefund.refundPrice} 元</span>
                        }
                    </FormItem> */}
                    <br />
                    {
                        (
                            <FormItem
                                {...formItemLayout}
                                label="房晚价格·退还金额"
                            >
                                {
                                    <span className="ant-form-text">{((partialHomeRefund && partialHomeRefund.refundPrice) || (wholeHomeRefund && wholeHomeRefund.refundPrice)) || 0} 元</span>
                                }
                            </FormItem>
                        )
                    }
                    <br />
                    {
                        // 客人提前离店情形
                        cancelType === '8' && (
                            <FormItem
                                {...formItemLayout}
                                label={'实际入住天数'}
                            >
                                {
                                    <span className="ant-form-text">{bookingDay} 天</span>
                                }
                            </FormItem>
                        )
                    }
                </div>
            </Fragment>
        )
    }

    onFaresChange = (key, val) => {
        let self = this
        const { cancelType } = this.state
        const {form, currentOrder} = this.props
        const { orderCostDetailView} = this.props.currentOrder
        let clearPrice = (orderCostDetailView && orderCostDetailView.clearPrice) || '0'
        let invoiceServicePrice = (orderCostDetailView && orderCostDetailView.invoiceServicePrice) || '0'
        let shouldReturnCashPrice = (orderCostDetailView && orderCostDetailView.shouldReturnCashPrice) || '0'
        let shouldReturnRoomPrice = orderCostDetailView && orderCostDetailView.shouldReturnRoomPrice || '0'
        let values = form.getFieldsValue()
        let maxReundValueMap = {
            clearPrice,
            invoiceServicePrice,
            cashPrice: shouldReturnCashPrice,
            roomPrice: shouldReturnRoomPrice
        }
        let isValid = this.validateRefundValue(key, val)
        if (!isValid) {
            message.warn('退款额不可超过最高限额')
            setTimeout(() => {
                self.props.form.setFieldsValue({[key]: maxReundValueMap[key]})
                if (cancelType !== '7') {
                    //if(values.realCheckoutDate === "")return
                    let payload = Object.assign({}, {
                        orderId: currentOrder.bookingId,
                        roomPrice: values.roomPrice || 0,
                        cashPrice: values.cashPrice || 0,
                        clearPrice: values.clearPrice || 0,
                        invoiceServicePrice: values.invoiceServicePrice || 0,
                        realCheckoutDate: values.realCheckoutDate !== "" ? values.realCheckoutDate.valueOf() : Date.now()
                    }, {
                        [key]: key === 'realCheckoutDate' ? ((val && val.valueOf() || Date.now())) : (maxReundValueMap[key] || 0)
                    })
                    self.getRecommendationRefund(payload)
                }
            }, 300)
            return
        }
        // 提前取消订单无需发起请求获取推荐退款价格
        if (cancelType === '7') return
        //if (values.realCheckoutDate === "") return
        // console.log('values', values)
        let payload = Object.assign({}, {
            orderId: currentOrder.bookingId,
            roomPrice: values.roomPrice || 0,
            cashPrice: values.cashPrice || 0,
            clearPrice: values.clearPrice || 0,
            invoiceServicePrice: values.invoiceServicePrice || 0,
            realCheckoutDate: values.realCheckoutDate !== "" ? values.realCheckoutDate.valueOf() : Date.now()
        }, {
            [key]: key === 'realCheckoutDate' ? ((val && val.valueOf() || Date.now())) : (val || 0)
        })
        // console.log('payload', payload)
        try {
            this.getRecommendationRefund(payload)
        } catch (e) {
            message.error(e)
        }
    }
    // 检验用户输入值是否大于其最高限额
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

    getRecommendationRefund = payload => {
        API.orderService.getRecommendationRefund(payload).then(res => {
            this.setState({
                customorPriceDetail: Object.assign({}, this.state.customorPriceDetail, res)
            })
        })
        .catch(err => message.error(err))
    }

    renderRefundableCom = () => {
        const { cancelType, customorPriceDetail } = this.state
        const { orderCostDetailView, checkinDate, checkoutDate, orderStatus } = this.props.currentOrder
        const { getFieldDecorator } = this.props.form
        // 当订单状态为待入住时，去除提前离店选项
        /**
         * 订单状态：待入住 入住中 允许客人提前取消订单
         * 订单状态：入住中 允许客人提前离店
         * 其他订单状态不显示
        */
        let newCancelTypeOptions = ['1207','1208'].includes(String(orderStatus))
        //let newCancelTypeOptions = String(orderStatus) === '1207'
            ? cancelTypeOptions.slice(0, 2)
            : String(orderStatus) === '1208'
                ? cancelTypeOptions.slice(1, 2)
                : []
        // if(orderStatus === '1207' || orderStatus === '1208'){
        //     newCancelTypeOptions.push({
        //         label: '其他退款',
        //         value: '9',
        //         key: '9'
        //     })
        // }
        let clearPrice = (orderCostDetailView && orderCostDetailView.clearPrice) || '0'
        let invoiceServicePrice = (orderCostDetailView && orderCostDetailView.invoiceServicePrice) || '0'
        let shouldReturnCashPrice = (orderCostDetailView && orderCostDetailView.shouldReturnCashPrice) || '0'
        let shouldReturnRoomPrice = orderCostDetailView && orderCostDetailView.shouldReturnRoomPrice || '0'
        // let leaveReturnRoomPrice = (orderCostDetailView && orderCostDetailView.leaveReturnRoomPrice || '0')
        let defaultReturnRoomPrice = (orderCostDetailView && orderCostDetailView.defaultReturnRoomPrice) || '0'
        return (
            <Fragment>
                {
                    <Fragment>
                        <FormItem>
                            <div>退款申请（仅限自有收款渠道订单可操作）<br />
                                <span style={{ color: 'red', fontWeight: 500 }}>说明：若房费及清洁费已进入房东钱包，该订单不可操作系统退款，请自行线下操作~感谢配合！</span>
                            </div>
                        </FormItem>
                        <br />
                        <FormItem>
                            <RadioGroup options={newCancelTypeOptions} onChange={this.switchcancelType}
                                value={cancelType}
                            />
                        </FormItem>
                        <br />
                    </Fragment>

                }
                <div className="abnormal-order-cover">
                    <FormItem
                        {...formItemLayout}
                        label={'清洁费·退还金额'}
                        extra={
                            `最高限额：${clearPrice} 元`
                        }
                    >
                        {
                            <Fragment>
                                {getFieldDecorator('clearPrice', {
                                    onChange: this.onFaresChange.bind(this, 'clearPrice'),
                                    initialValue: 0 })(
                                    <InputNumber min={0} max={clearPrice} />
                                )}
                                <span className="ant-form-text"> 元</span>
                            </Fragment>
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={'发票服务费·退还金额'}
                        extra={
                            `最高限额：${invoiceServicePrice} 元 ${cancelType === '8' || cancelType === '9' ? '推荐退款：' + customorPriceDetail.customorInvoiceServicePrice + ' 元' : ''}`
                        }
                    >
                        {

                            <Fragment>
                                {getFieldDecorator('invoiceServicePrice', {
                                    onChange: this.onFaresChange.bind(this, 'invoiceServicePrice'),
                                    initialValue: 0 })(
                                    <InputNumber min={0} max={
                                        invoiceServicePrice
                                    }
                                    />
                                )}
                                <span className="ant-form-text"> 元</span>
                            </Fragment>

                        }
                    </FormItem>
                    {/* <FormItem
                        {...formItemLayout}
                        label={'消费金·退还金额'}
                        extra={
                            `最高限额：${shouldReturnCashPrice} 元 ${cancelType === '8' ? '推荐退款：' + customorPriceDetail.customorCashPrice + ' 元' : ''}`
                        }
                    >
                        {

                            <Fragment>
                                {getFieldDecorator('cashPrice', { initialValue: 0 })(
                                    <InputNumber min={0} max={shouldReturnCashPrice} />
                                )}
                                <span className="ant-form-text"> 元</span>
                            </Fragment>
                        }
                    </FormItem> */}
                    <br />
                    {
                        (
                            <FormItem
                                {...formItemLayout}
                                label="房晚价格·退还金额"
                                extra={
                                    `最高限额：${shouldReturnRoomPrice} 元 ${cancelType === '8' || cancelType === '9' ? '推荐退款：' + customorPriceDetail.customorRoomPrice + ' 元' : ''}`
                                }
                            >
                                {

                                    <Fragment>
                                        {getFieldDecorator('roomPrice', {
                                            onChange: this.onFaresChange.bind(this,'roomPrice'),
                                            initialValue: cancelType === '8' || cancelType === '9'
                                                ? 0
                                                : defaultReturnRoomPrice
                                        })(
                                            <InputNumber min={0} max={
                                                shouldReturnRoomPrice
                                            }
                                            />
                                        )}
                                        <span className="ant-form-text"> 元</span>
                                    </Fragment>

                                }
                            </FormItem>
                        )
                    }
                    <br />
                    {
                        // 客人提前离店情形
                        cancelType === '8' && (
                            <FormItem
                                { ...tailFormItemLayout}
                                label={'实际退房日期'}
                            >
                                {

                                    <Fragment>
                                        {getFieldDecorator('realCheckoutDate', {
                                            onChange: this.onFaresChange.bind(this, 'realCheckoutDate'),
                                            initialValue: moment(Date.now()) })(
                                            <DatePicker
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"
                                                disabledDate={function (current) {
                                                    return current && (current < moment(checkinDate).endOf('day') || current > moment(checkoutDate).endOf('day'))
                                                }}
                                            />
                                        )}
                                    </Fragment>

                                }
                            </FormItem>
                        )
                    }
                    <br />
                    {
                        cancelType === '8' && <FormItem>
                            <p>（提示：总退还金额：{customorPriceDetail.customorTotalPrice}元，其中消费金退还金额：{customorPriceDetail.customorCashPrice} 元，现金退还：{customorPriceDetail.customorPrice} 元）</p>
                        </FormItem>
                    }
                    {
                        cancelType === '9' && <FormItem>
                            <p>（此退款发起后第二天晚上9点系统自动退款，房态不调整。</p>
                        </FormItem>
                    }
                </div>
            </Fragment>
        )

    }

    render = () => {
        const { visible } = this.props
        const self = this
        return (
            <Modal
                width={800}
                className="abnormal-order-modal"
                title={'订单异常处理'}
                visible={visible}
                onOk={this.handleOk}
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
