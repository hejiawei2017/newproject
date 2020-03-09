import React, { Component } from 'react'
import { Drawer, Button, Tabs, Tooltip, Icon, message, Popconfirm, Spin } from 'antd'
import { connect } from "react-redux"
import './orderDetail.less'
import { sourseType, orderStatusType, cardType, memberCardCodeList } from 'utils/dictionary'
import Timeline from 'components/timeline'
import CustomTable from 'components/customTable'
import { dataFormat, envConfig } from 'utils/utils'
import DepositModal from './depositModal'
import AbnormalOrderModal from './abnormalOrderModal'
import ChangeDateModal from './changeDateModal'
import ChangeRoomModal from './changeRoomModel'
import OrderLogModal from './orderLogModal'
import HandworkOrderModal from './handworkOrderModal'
import HandFreezeOrderModal from './handFreezeOrderModal'
import HandFreezeDisplayModal from './handFreezeDisplayModal'
import HandFreezeAheadModal from './handFreezeAheadModal'
import HandFreezeDoneModal from './handFreezeDoneModal'
import PasswordModal from './passwordModal'
import {getOperationLogs, getOrderDetail} from '../../actions/order'
import {orderService, freezeServer} from '../../services'
import SubTable from '../../components/subTable'
import { equalsRoleExist, equalsUserExistSuperAuth } from "../../utils/getUserRole";
// import '../../mock/orderFreeze/mockTest.js'
import global from '../../utils/Global'
import moment from 'moment'

const TabPane = Tabs.TabPane
let refundDepositPrice = 0
let isEdit
const CustomLabel = (labelTxt, tooltipTxt) => (
    <Tooltip placement="topLeft" title={tooltipTxt}>
        {labelTxt}
        <Icon type="info-circle-o" style={
            {
                color: '#1890ff',
                marginLeft: 8
            }}
        />
    </Tooltip>
)

@connect(state => ({
    currentOrder: state.order.currentOrder,
    userRoleInfo: state.userRoleInfo
}))

export default class OrderDetail extends Component {
    state = {
        loading: false,
        freezeLoading: false,
        refundLoading: false,
        value: 0,
        previous: 0,
        depositVisible: false,
        abnormalOrderVisible: false,
        changeDateVisible: false,
        changeRoomVisible: false,
        passwordVisible: false,
        logVisible: false,
        handworkVisible: false,
        handFreeVisible: false,
        handDisplayVisible: false,
        handAheadVisible: false,
        handDoneVisible: false,
        freezeInfo: {},
        refundInfo: {}
    }

    onClose = () => {
        this.props.onClose()
    }

    compareTmrTime = (date) => { //比较退房时间是否在次日下午六点前
        const tmrDate = moment(date).add(1, 'd').set('hour', 18).set('minute',0)
        const curDate = moment();
        return curDate.isBefore(tmrDate)
    }

    renderOrderBtn = () => {
        const self = this
        const { currentOrder, userRoleInfo } = this.props
        const { orderRefundView, depositStatus, orderStatus, orderCostDetailView, source, checkoutDate } = currentOrder
        // console.log(currentOrder, orderCostDetailView, "orderCostDetailView", equalsRoleExist('ROLE_BU'))
        const status = orderStatusType[orderStatus]
        const refundStatus = orderRefundView && orderRefundView.refundStatus
        const isOwnPlatform = ['APP', 'MP', 'MINI_PROGRAM', 'H5', 'WEB', 'NEW_MINI_PROGRAM'].includes(source) // 订单来源是否是自有平台
        // 待支付、咨询、咨询同意、咨询拒绝显示关闭订单按钮
        const displayCancelButtonStatus = ['1102', '1101', '1201', '1210']
        /**
         * 只有客服，客服主管，超级管理员，可以使用修改订单和换房型
         */
        const role = global.role
        function checkAdult (r) {
            if(r === "AUTH_CUSTOMER_SERVICE_ADMIN" || r === "AUTH_CUSTOMER_SERVICE_MANAGER" || r === "AUTH_ADMIN" || r === "AUTH_SUPER" ){
                return r
            }
        }
        const havePermission = role.filter((checkAdult))
        const canChangeHouse = havePermission.length !== 0 ? true : false
        /**
         * -------------------------
         * 订单操作按钮可分为手工单的操作按钮，非手工单的冻结/解冻保证金按钮、订单异常处理按钮和操作日志按钮
         * -------------------------
         * 1、手工单操作按钮根据 orderType 是否为 1 和 3 进行展示，0 为正常订单，1 为手工订单，2 刷单，3 为手工扫码单
         *  1.1手工单取消订单按钮
         * 2、非手工单中
         *  2.1 冻结/解冻保证金按钮
         *      只有在订单状态为入住中和已退房才有该操作按钮
         *
         *      冻结/解冻按钮可分为 3 种状态，冻结保证金，解冻保证金编辑态和解冻保证金展示态
         *  2.2 订单异常处理按钮
         *      只有在订单状态为待入住、入住中和已退房才有该操作按钮
         *          订单异常处理编辑态：
         *          订单异常处理已展示态：
         *          以上状态详见下面
         * 3、增加途家渠道冻结保证金和提前退保证金入口
         *      权限为BU管家
         *      冻结保证金为订单状态为入住中～退房日隔天 下午六点
         *      提前退保证金为订单状态为退房日隔天 下午六点
         *      保证金不为0的前提下
         * 注：订单异常处理按钮改为账务管理
         */

        return (
            <div className="order-detail-depositStatus__btns">
                {
                    orderCostDetailView.depositPrice !== 0 && ( equalsRoleExist('ROLE_BU') || equalsRoleExist('ROLE_CUSTOMER_SERVICE_ADMIN') || equalsUserExistSuperAuth(['AUTH_ADMIN','AUTH_SUPER']) ) && ( ( status === '已退房' && this.compareTmrTime(checkoutDate) ) || status === '入住中' ) && (sourseType[source] === '途家Api' ) ?
                    <Button
                        ghost
                        className={"mt5"}
                        size="small"
                        loading={this.state.freezeLoading}
                        type="primary"
                        onClick={ function () { self.controlFreeze() } }
                    >冻结保证金</Button> : null
                }
                <Button style={{display: 'none'}} className={"mt5"} ghost type="primary" onClick={this.toggleHandworkModal}>操作</Button>
                {
                    status !== '已取消' && !isOwnPlatform && canChangeHouse && <Button className={"mt5"} size="small" ghost type="primary" onClick={this.props.showCancleOrder}>取消订单</Button>
                }
                {
                    (status === '待入住' || status === '入住中' || status === '已退房') && canChangeHouse &&
                    <React.Fragment>
                        <Button className={"mt5"} size="small" ghost type="primary" onClick={this.toggleChangeRoomModal}>换房型</Button>
                        <Button className={"mt5"} size="small" ghost type="primary" onClick={this.props.showSetOrder}>修改订单</Button>
                    </React.Fragment>
                }
                {/* {
                    currentOrder.paymentTerm === 0 && (status === '待入住' || status === '入住中' || status === '已退房') &&
                        <React.Fragment>
                            <Button className={"mt5"} size="small" ghost type="primary" onClick={this.props.showSetOrder}>修改订单</Button>
                            <Popconfirm placement="topLeft" title="确定取消订单吗？" onConfirm={function () {
                                self.cancleOrderNoParam()
                            }} okText="Yes" cancelText="No"
                            >
                                <Button
                                    ghost
                                    className={"mt5"}
                                    size="small"
                                    loading={this.state.loading}
                                    type="primary"
                                >取消订单</Button>
                            </Popconfirm>
                        </React.Fragment>
                } */}
                {/* {
                    currentOrder.paymentTerm === null && !isOwnPlatform &&
                    <React.Fragment>
                        <Button className={"mt5"} size="small" ghost type="primary" onClick={this.props.showSetOrder}>修改订单</Button>
                        <Popconfirm placement="topLeft" title="确定取消订单吗？" onConfirm={function () {
                            self.cancleOrderConfirm()
                        }} okText="Yes" cancelText="No"
                        >
                            <Button
                                ghost
                                className={"mt5"}
                                size="small"
                                loading={this.state.loading}
                                type="primary"
                            >取消订单</Button>
                        </Popconfirm>
                    </React.Fragment>
                } */}
                {
                    ((currentOrder.hotelType === 1 || currentOrder.hotelType === 2 || currentOrder.hotelType === 3)) && status !== '已取消' &&
                    <React.Fragment>
                        <Button className={"mt5"} size="small" ghost type="primary" onClick={this.togglePasswordModal}>房号&密码</Button>
                    </React.Fragment>
                }
                {
                    isOwnPlatform && currentOrder.orderType !== 1 ?
                    <React.Fragment>
                        {
                            ((status === '已退房' ||
                                status === '入住中') && Boolean((orderCostDetailView && orderCostDetailView.depositPrice)) &&
                                sourseType[source] !== '线下')
                            && (
                                <Button
                                    onClick={this.toggleDepositModal}
                                    className={"mt5"}
                                    ghost type="primary"
                                    size="small"
                                    disabled={!isEdit}
                                >
                                    {
                                        (
                                            refundStatus === '6' && depositStatus === 0
                                                ? '冻结保证金'
                                                : '解冻保证金'
                                        )
                                    }
                                </Button>
                            )
                        }
                        {
                            ((status === '待入住' ||
                                    status === '入住中' || status === '已退房') &&
                                sourseType[source] !== '线下' &&
                                depositStatus === 0
                                // 如果订单有保证金冻结操作，需要在解冻保证金后，才可以进行异常订单处理
                            ) &&
                            (
                                <Button
                                    ghost
                                    className={"mt5"}
                                    type="primary"
                                    size="small"
                                    onClick={this.toggleAbnormalOrderModal}
                                >订单异常处理</Button>
                            )
                        }
                        {/* {
                            ((status === '待入住' || status === '入住中' || status === '已退房') &&
                                sourseType[source] !== '线下'
                                // 待入住和不是线上的 可以修改订单时间
                            ) &&
                            (
                                <Button
                                    ghost
                                    className={"mt5"}
                                    type="primary"
                                    size="small"
                                    onClick={this.toggleChangeDateModal}
                                >修改订单时间</Button>
                            )
                        } */}
                        {
                            displayCancelButtonStatus.indexOf(orderStatus) > -1 ?
                            <Popconfirm placement="topLeft" title="确定关闭订单吗？关闭后将结束对应消息回话，用户可重新发起咨询联系房东。" onConfirm={this.closeOrderConfirm} okText="Yes" cancelText="No">
                                <Button
                                    ghost
                                    className={"mt5"}
                                    size="small"
                                    loading={this.state.loading}
                                    type="primary"
                                >关闭订单</Button>
                            </Popconfirm> : null
                        }
                        <Popconfirm placement="topLeft" title="当前同步将释放房态，是否继续同步？" onConfirm={this.asyncHouseConfirm} okText="Yes" cancelText="No">
                            <Button className={"mt5"} ghost size="small" type="primary">同步房态</Button>
                        </Popconfirm>
                    </React.Fragment> : null
                }
                {
                    /*
                    * 暂时注释代码 查看提前退保证金功能
                    */
                   orderCostDetailView.depositPrice !== 0 && ( equalsRoleExist('ROLE_BU') || equalsRoleExist('ROLE_CUSTOMER_SERVICE_ADMIN') || equalsUserExistSuperAuth(['AUTH_ADMIN','AUTH_SUPER']) ) && ( status === '已退房' && this.compareTmrTime(checkoutDate) ) && ( sourseType[source] === '途家Api' ) ?
                    <Button
                        ghost
                        className={"mt5"}
                        size="small"
                        loading={this.state.refundLoading}
                        type="primary"
                        onClick={ function () { self.controlRefund() } }
                    >提前退保证金</Button> : null
                }
            </div>
        )

    }
    toggleDepositModal = () => {
        this.setState({
            depositVisible: !this.state.depositVisible
        })
    }
    getOrderDetailInfo = (id) => {
        message.success('正在更新页面数据')
        const { dispatch } = this.props
        dispatch(getOrderDetail(id)).then(() => {
            message.success('更新成功')
        }).catch(() => {

        })
    }
    //取消API订单
    cancleOrderConfirm = () => {
        const {currentOrder} = this.props
        const { bookingId } = currentOrder
        if(this.state.loading) {
            message.warning('提交中，请稍后!')
            return;
        }
        this.setState({
            loading: true
        })
        orderService.orderCloseTuJia({
            bookingId: bookingId
        }).then((res) =>{
            this.setState({
                loading: false
            })
            message.success('关闭成功')
            this.getOrderDetailInfo(bookingId)
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }
    //取消非路客收款手工订单
    cancleOrderNoParam = () => {
        const {currentOrder} = this.props
        const { bookingId } = currentOrder
        if(this.state.loading) {
            message.warning('提交中，请稍后!')
            return;
        }
        this.setState({
            loading: true
        })
        orderService.handOrderCancel({
            bookingId: bookingId
        }).then((res) =>{
            this.setState({
                loading: false
            })
            message.success('关闭成功')
            this.getOrderDetailInfo(bookingId)
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }
    //关闭订单
    closeOrderConfirm = () => {
        const {currentOrder} = this.props
        const { bookingId } = currentOrder
        if(this.state.loading) {
            message.warning('提交中，请稍后!')
            return;
        }
        this.setState({
            loading: true
        })
        orderService.orderClose({
            bookingId: bookingId
        }).then((res) =>{
            this.setState({
                loading: false
            })
            message.success('关闭成功')
            this.getOrderDetailInfo(bookingId)
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }
    asyncHouseConfirm = () => {
        const {currentOrder} = this.props
        const { bookingId } = currentOrder
        if(this.state.loading) {
            message.warning('提交中，请稍后!')
            return;
        }
        this.setState({
            loading: true
        })
        orderService.synchroHouse({
            bookingId: bookingId
        }).then((res) =>{
            this.setState({
                loading: false
            })
            message.success('同步成功')
            this.getOrderDetailInfo(bookingId)
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }
    toggleChangeDateModal = () => {
        this.setState({
            changeDateVisible: !this.state.changeDateVisible
        })
    }
    toggleChangeRoomModal = () => {
        this.setState({
            changeRoomVisible: !this.state.changeRoomVisible
        })
    }
    togglePasswordModal = () => {
        this.setState({
            passwordVisible: !this.state.passwordVisible
        })
    }
    toggleAbnormalOrderModal = () => {
        const {depositStatus} = this.props.currentOrder
        // 当保证金状态为冻结状态时，需进行解冻保证金后才可进行订单异常处理操作
        if (String(depositStatus) === '1') {
            message.warn('请先解冻保证金，再进行订单异常处理操作。')
            return
        }
        this.setState({
            abnormalOrderVisible: !this.state.abnormalOrderVisible
        })
    }

    toggleLogModal = () => {
        const {currentOrder} = this.props
        if (!this.state.logVisible) {
            let params = {
                pageNum: 1,
                pageSize: 10,
                randomId: currentOrder.randomId
            }
            this.props.dispatch(getOperationLogs(params))
            .then(() => {
                this.setState({
                    logVisible: !this.state.logVisible
                })
            })
            .catch(e => {
                message.error(e)
            })
        } else {
            this.setState({
                logVisible: !this.state.logVisible
            })
        }
    }

    toggleHandworkModal = () => {
        this.setState({
            handworkVisible: !this.state.handworkVisible
        })
    }

    toggleHandleFreezeModal = () => { //冻结保证金确认弹窗
        const apiOrderId = this.props.extendData ? this.props.extendData.apiOrderId : ''
        let handFreeVisible = this.state.handFreeVisible
        this.setState({
            handFreeVisible: !handFreeVisible
        })
    }

    toggleHandleDisplayModal = () => { //冻结保证金显示信息弹窗
        let handDisplayVisible = this.state.handDisplayVisible
        this.setState({
            handDisplayVisible: !handDisplayVisible
        })
    }

    toggleHandleAheadModal = () => { //提前退保证金信息弹窗
        let handAheadVisible = this.state.handAheadVisible
        this.setState({
            handAheadVisible: !handAheadVisible
        })
    }

    toggleHandleDoneModal = () => { //提前退保证金完成弹窗
        let handDoneVisible = this.state.handDoneVisible
        this.setState({
            handDoneVisible: !handDoneVisible
        })
    }

    controlFreeze = () => { //冻结保证金弹窗
        const apiOrderId = this.props.extendData ? this.props.extendData.apiOrderId : ''
        this.setState ({
            freezeLoading: true
        });
        freezeServer.getFreezeStatus({ id: apiOrderId }).then((data)=>{
            console.log(data,"data")
            const randomBol = data.chargeStatus
            const viewType = data.viewType
            if( randomBol === 0 ) { //如果是未填写状态
                this.setState({
                    freezeLoading: false
                }, function () {
                    this.toggleHandleFreezeModal();
                })
            } else if ( randomBol === 1 ){ //如果是已经填写的状态
                if(viewType === "freeZe") {
                    this.setState({
                        freezeInfo: data,
                        freezeLoading: false
                    }, function () {
                        this.toggleHandleDisplayModal();
                    })
                } else {
                    message.warning('您已提前退保证金，不能进行冻结操作')
                    this.setState({
                        freezeLoading: false
                    })
                }
            } else {
            }
        }).catch(err=>{
            this.setState ({
                freezeLoading: false
            });
        })
    }

    controlRefund = () => { //提前退保证金完成弹窗
        const apiOrderId = this.props.extendData ? this.props.extendData.apiOrderId : ''
        this.setState ({
            refundLoading: true
        });
        freezeServer.getFreezeStatus({ id: apiOrderId }).then((data)=>{
            const randomBol = data.chargeStatus
            const viewType = data.viewType
            if( randomBol === 0 ) { //如果是未填写状态
                this.setState({
                    refundLoading: false
                }, function () {
                    this.toggleHandleAheadModal();
                })
            } else if ( randomBol === 1 ){ //如果是已经填写的状态
                if(viewType === "refund") {
                    this.setState({
                        refundInfo: data,
                        refundLoading: false
                    }, function () {
                        this.toggleHandleDoneModal();
                    })
                } else {
                    message.warning('您已冻结保证金，不能进行提前退还保证金操作')
                    this.setState({
                        refundLoading: false
                    })
                }
            } else {
            }
        }).catch(err=>{
            this.setState ({
                refundLoading: false
            });
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

    // 提交申请预留保单
    submitApplyBatchPolicyNoPay = (record) => {
        orderService.postPolicyNoPay({
            orderGuestId: record.orderGuestId,
            flag: record.resultCode
        }).then(res => {
            message.success('操作成功');
            this.tablePolicyThis.renderTable();
        })
    }

    render = () => {
        const {
            randomId,
            source,
            houseNo,
            cityName,
            payTradeNo,
            roomNum,
            bookingDate,
            bookingDay,
            bookingMemberId,
            checkinDate,
            bookingMemberMobile,
            checkoutDate,
            ordergustList,
            createTime,
            payTradeTime,
            // editTime,
            hasPay,
            amount,
            orderStatus,
            orderType,
            paymentTerm,
            orderCostDetailView,
            orderRefundView,
            orderHouseView,
            depositStatus,
            refundRequestDate,
            refundTime,
            depositOperateFlag,
            overTenantNumber,
            tenantNumber,
            isNeedInvoice,
            realCheckoutDate,
            bookingMemberName,
            sourceRemark,
            couponId
        } = this.props.currentOrder
        const { freezeInfo, refundInfo } = this.state;
        const apiOrderId = this.props.extendData ? this.props.extendData.apiOrderId : ''
        const refundViewList = (orderRefundView && orderRefundView.refundViewList) ? orderRefundView.refundViewList : []
        const refundStatus = orderRefundView && orderRefundView.refundStatus
        const clearingRefund = refundViewList.find(item => item.refundItemType === '1')
        const bookingRefund = refundViewList.find(item => item.refundItemType === '3')
        const invoiceRefund = refundViewList.find(item => item.refundItemType === '4')
        const partialHomeRefund = refundViewList.find(item => item.refundItemType === '2') //退还房费价格
        const wholeHomeRefund = refundViewList.find(item => item.refundItemType === '6')
        const depositReund = orderRefundView && orderRefundView.refundViewList.find(item => item.refundItemType === '7')
        const cashRefund = orderRefundView && orderRefundView.refundViewList.find(item => item.refundItemType === '8')
        isEdit = (!clearingRefund && !bookingRefund && !invoiceRefund && !(wholeHomeRefund || partialHomeRefund)) ? true : false
        //wholeHomeRefund 或者 partialHomeRefund 有值的情况下 其他参数为undefined 显示查看视图

        /**
         * -------------------------------
         * 时间进度条的 labels 和 values
         */
        let VALUES = [createTime, payTradeTime].map(item => item ? dataFormat(item, 'YYYY-MM-DD HH:mm:ss') : '')
        let LABELS = ['提交订单', '支付订单']
        let ACTUAL_VALUES
        let ACTUAL_LABELS

        if (orderStatus === '1208' || orderStatus === '1104') {
            // 入住中状态或正常入住退房
            ACTUAL_LABELS = LABELS.concat(['入住中', '已退房'])
            ACTUAL_VALUES = VALUES.concat([checkinDate, checkoutDate])
        } else if (orderStatus === '1105' && bookingDay) {
            // 入住后，中途退房
            ACTUAL_LABELS = LABELS.concat(['入住中', '退款中', '已退款'])
            ACTUAL_VALUES = VALUES.concat([checkinDate, refundRequestDate, refundTime])
        } else if ((orderStatus === '1105' && !bookingDay) || (orderStatus === '1106' && !bookingDay) || (refundStatus === '4' && !bookingDay)) {
            // 订单支付后，直接退款
            ACTUAL_LABELS = LABELS.concat(['退款中', orderStatus === '1106' ? '已取消' : '已退款'])
            ACTUAL_VALUES = VALUES.concat([refundRequestDate, refundTime])
        } else {
            ACTUAL_LABELS = LABELS.concat(['入住中', '已退房'])
            ACTUAL_VALUES = VALUES.concat([checkinDate, checkoutDate])
        }

        const orderStatusProgress = {
            '1101': 0,
            '1210': 0,
            '1201': 0,
            '1205': 0,
            '1102': 0,
            '1207': 1,
            '1208': 2,
            '1109': 0,
            '1106': 3,
            '1104': 3,
            '1105': 3
        }
        const sourceCategory = orderType === 0
            ? ['APP', 'MP', 'MINI_PROGRAM', 'H5', 'WEB'].includes(source)
                ? '自有平台订单'
                : 'API订单'
            : '手工订单'

        refundDepositPrice = depositReund && depositReund.refundPrice

        /*
        * ------------------------
        * 冻结/解冻按钮可分为 3 种状态，冻结保证金，解冻保证金编辑态和解冻保证金展示态
        * 冻结保证金态：depositOperateFlag 为 0（未进行冻结操作） 并且 depositStatus 为 0（保证金状态为未冻结） 处于未冻结状态下
        * 解冻保证金编辑态：depositStatus 为 1（保证金状态为已冻结） 处于冻结状态下
        * 解冻保证金展示态：depositOperateFlag 为 1 时，表示已进行退款操作
        */
        const depositStatusMode = depositOperateFlag === 0 && depositStatus === 0
            ? 'frozen'
            : depositStatus === 1
                ? 'edit'
                : 'display'
        /**
         * -------------------------------
         * 自定义表格数据
         */
        const ORDER_INFO = [
            { key: '支付单号', value: payTradeNo },
            { key: '预定日期', value: bookingDate },
            { key: '用户 ID', value: bookingMemberId },
            { key: '预定人姓名', value: bookingMemberName},
            { key: '入住日期', value: checkinDate },
            { key: '预订人手机', value: bookingMemberMobile },
            { key: '退房日期', value: checkoutDate },
            { key: '入住人数', value: tenantNumber },
            { key: '实际退房日期', value: realCheckoutDate },
            { key: '预订房数', value: roomNum },
            { key: '超过房客', value: overTenantNumber },
            { key: '是否开具发票', value: isNeedInvoice === '1' ? '是' : '否' },
            { key: '优惠卷ID', value: couponId }
        ]
        // 如果退款进度为可操作退款，则资金明细不显示
        let isRefundable = (orderRefundView && orderRefundView.refundStatus === '6')
        const OTHER_INFO = [{
            tabName: '费用明细',
            cols: 2,
            dataSource: [{
                key: '支付总计',
                value: hasPay || 0
            }, {
                key: CustomLabel('预订总费用', '不包括保证金'),
                value: amount || 0
            }, {
                key: '房晚价格',
                value: (orderCostDetailView && orderCostDetailView.roomPrice) || 0
            }, {
                key: '保证金',
                value:(orderCostDetailView && orderCostDetailView.depositPrice) || 0
            }, {
                key: '清洁费',
                value: (orderCostDetailView && orderCostDetailView.clearPrice) || 0
            }, {
                key: CustomLabel('消费现金抵扣', '可开发票'),
                value: (orderCostDetailView && orderCostDetailView.cashPrice) || 0
            }, {
                key: CustomLabel('优惠减免', '房晚券、优惠券、消费现金等'),
                value: (orderCostDetailView && orderCostDetailView.couponAmount) || 0
            }, {
                key: '会员折扣',
                value: (orderCostDetailView && orderCostDetailView.discountAmount)
                || '无'
            }, {
                key: '增值服务',
                value: '' || 0
            }, {
                key: '发票服务费',
                value: (orderCostDetailView && orderCostDetailView.invoiceServicePrice) || 0
            }, {
                key: CustomLabel('额外费用', '超过人房客'),
                value: (orderCostDetailView && orderCostDetailView.overTenantPrice) || 0
            }, {
                key: '开票金额',
                value: amount || 0
            }, {
                key: '退订险金额',
                value: '' || 0
            }, {
                key: '房东应返款',
                value: (orderCostDetailView && orderCostDetailView.transferPrice) || 0
            }, {
                key: '平台服务费',
                value: (orderCostDetailView && orderCostDetailView.platformPrice) || 0
            }, {
                key: '收款方式',
                value: paymentTerm === 1 ? '路客收款' : ''
            }]
        }, {
            tabName: '客人信息',
            cols: 2,
            dataSource: !ordergustList ? [] : ordergustList.map(guest => {
                return {
                    key: '姓名',
                    value: guest.name ? guest.name : '',
                    dataSource: [{
                        key: '姓名',
                        value: guest.name ? guest.name : ''
                    }, {
                        key: '微信昵称',
                        value: guest.nickName
                    }, {
                        key: '身份证号码',
                        value: guest.cardType === '01' ? guest.cardNo : ''
                    }, {
                        key: '手机号码',
                        value: guest.phone
                    }, {
                        key: '会员等级',
                        value: memberCardCodeList[guest.memberCardCode] ? memberCardCodeList[guest.memberCardCode].name : ''
                    }, {
                        key: '护照号码',
                        value: cardType === '02' ? guest.cardNo : ''
                    }, {
                        key: '用户标签',
                        value: guest.label
                    }, {
                        key: '用户 ID',
                        value: guest.userId
                    }, {
                        key: '所属公司',
                        value: guest.company
                    }, {
                        key: '企业邮箱',
                        value: guest.mail
                    }]
                }
            })
        }, {
            tabName: '资金流转',
            cols: 2,
            dataSource: [{
                key: '退款发起时间',
                value: isRefundable ? '/' : (orderRefundView && orderRefundView.refundRequestDate) || '无'
            }, {
                key: '退还保证金',
                value: isRefundable ? '/' : (orderRefundView && refundDepositPrice) || 0
            }, {
                key: '应退储值金',
                value: isRefundable ? '/' : (cashRefund && cashRefund.refundPrice)
            }, {
                key: '退款操作者',
                value: isRefundable ? '/' : (orderRefundView && orderRefundView.operateor) || '无'
            }, {
                key: '退还房费价格',
                value: isRefundable ? '/' : ((partialHomeRefund && partialHomeRefund.refundPrice) || (wholeHomeRefund && wholeHomeRefund.refundPrice)) || 0
            }, {
                key: '退还清洁费',
                value: isRefundable ? '/' : (clearingRefund && clearingRefund.refundPrice) || 0
            }, {
                key: '退还预订服务费',
                value: isRefundable ? '/' : (bookingRefund && bookingRefund.refundPrice) || 0
            }, {
                key: '退还发票服务费',
                value: isRefundable ? '/' : (invoiceRefund && invoiceRefund.refundPrice) || 0
            }]
        }, {
            tabName: '房源信息',
            cols: 2,
            dataSource: [{
                key: '房源编号',
                value: orderHouseView && orderHouseView.houseNo
            }, {
                key: '房源标题',
                value:
                    CustomLabel((orderHouseView && orderHouseView.title && orderHouseView.title.slice(0, 19).concat('...')), orderHouseView && orderHouseView.title)
            }, {
                key: '助理房东姓名',
                value: orderHouseView && orderHouseView.houseManagerAssistName
            }, {
                key: 'BU姓名',
                value: orderHouseView && orderHouseView.buName
            }, {
                key: '助理房东手机号码',
                value: orderHouseView && orderHouseView.houseManagerAssistPhone
            }, {
                key: 'BU手机号码',
                value: orderHouseView && orderHouseView.buMobile
            }]
        }, {
            tabName: '保单信息',
            cols: 2
        }]

        const that = this;
        const columns = [
            {title: '姓名', dataIndex: 'name', width: 80},
            {title: '手机号', dataIndex: 'phone', width: 100},
            {title: '保险单号', dataIndex: 'policyNo', width: 150},
            {title: 'URL', dataIndex: 'downLoadUrl', width: 150, render: (val, record) => {
                if(record.message === '投保成功'){
                    return <span style={{wordWrap: 'break-word'}}>{val}</span>;
                }else {
                    return <span style={{wordWrap: 'break-word'}}>{`${envConfig.wxShareUrl}/index.html?sid=${record.encryptionOrderNo}`}</span>
                }
            }},
            {title: '保险购买状态', dataIndex: 'message', width: 100, render: (val, record) => {
                return (
                    <div>
                        <span>{val}</span>
                        {
                            record.resultCode === '0' || record.resultCode === '1' ? (
                                <Popconfirm
                                title="确定预留保单吗?"
                                onConfirm={function () {
                                    that.submitApplyBatchPolicyNoPay(record);
                                }}
                                okText="确认"
                                cancelText="取消"
                                >
                                    <Button size="small" type="primary">申请预留保单</Button>
                                </Popconfirm>
                            ) : null
                        }

                    </div>
                )
            }}
        ]
        const subTableItem = {
            getTableService: orderService.getPolicyTable,
            columns: columns,
            searchFields: {
                orderNo: randomId
            },
            refsTab: (ref) => {
                this.tablePolicyThis = ref
            },
            isClosePagination: true,
            rowKey: "id",
            antdTableProps: {
                bordered: true
            }
        }

        return (
            this.props.visible ? (
                <Drawer
                    title="订单详情"
                    placement="right"
                    closable
                    onClose={this.onClose}
                    visible
                    width={1120}
                    className="order-detail"
                >
                    <DepositModal visible={this.state.depositVisible} mode={depositStatusMode
                    } toggleDepositModal={this.toggleDepositModal}
                    />
                    {
                        this.state.passwordVisible && <PasswordModal visible={this.state.passwordVisible} togglePasswordModal={this.togglePasswordModal} />
                    }
                    <ChangeRoomModal visible={this.state.changeRoomVisible} toggleChangeRoomModal={this.toggleChangeRoomModal} />
                    <ChangeDateModal visible={this.state.changeDateVisible} toggleChangeDateModal={this.toggleChangeDateModal} />
                    <AbnormalOrderModal visible={this.state.abnormalOrderVisible} toggleAbnormalOrderModal={this.toggleAbnormalOrderModal} isEdit={isEdit} />
                    <OrderLogModal visible={this.state.logVisible} toggleLogModal={this.toggleLogModal} />
                    <HandworkOrderModal visible={this.state.handworkVisible} toggleHandworkModal={this.toggleHandworkModal} />
                    <HandFreezeOrderModal orderCostDetailView={orderCostDetailView} visible={this.state.handFreeVisible} toggleHandleFreezeModal={this.toggleHandleFreezeModal} />
                    <HandFreezeDisplayModal orderCostDetailView={orderCostDetailView} freezeInfo={freezeInfo} visible={this.state.handDisplayVisible} toggleHandleDisplayModal={this.toggleHandleDisplayModal} />
                    <HandFreezeAheadModal visible={this.state.handAheadVisible} toggleHandleAheadModal={this.toggleHandleAheadModal} />
                    <HandFreezeDoneModal visible={this.state.handDoneVisible} refundInfo={refundInfo} toggleHandleDoneModal={this.toggleHandleDoneModal} />
                    <section className="order-detail-progress">
                        <h2 className="order-h2">订单进度概况</h2>
                        <div className="order-detail-progress__wrapper">
                            <div className="order-detail-progress__left  order-card">

                                <ul className="order-detail-progress__info">
                                    <li>
                                        行程编号/订单号：{apiOrderId ? apiOrderId : randomId}
                                    </li>
                                    <li>
                                        平台订单号：{apiOrderId ? apiOrderId : '-'}
                                    </li>
                                    <li>
                                        订单创建时间：{
                                        dataFormat(bookingDate, 'YYYY-MM-DD HH:mm:ss')
                                    }
                                    </li>
                                    <li>
                                        订单来源：{this.transSourceStr(source,sourceRemark)}


                                    </li>
                                    <li>
                                        房源编号：{houseNo}
                                    </li>
                                    <li>
                                        房源城市：{
                                        cityName
                                    }
                                    </li>
                                </ul>
                                <div
                                    className="order-detail-progress__timeline"
                                >
                                    <Timeline
                                        index={orderStatusProgress[orderStatus]}
                                        indexClick={function (index) {
                                            return false
                                        }}
                                        values={ACTUAL_VALUES}
                                        getLabel={function (val, index) {
                                            let labels = ACTUAL_LABELS
                                            return (
                                                <div className="timeline-labels">
                                                    <p>{labels[index]}</p>
                                                    <p>{val}</p>
                                                </div>
                                            )
                                        }}
                                        pointPadding={60}
                                        styles={{ background: '#f8f8f8', foreground: '#1890ff', outline: '#dfdfdf' }}
                                    ></Timeline>
                                </div>
                            </div>
                            <div className="order-detail-progress__right order-card">
                                <h2 className="order-h2">订单状态</h2>
                                <h1 className="order-h1">
                                    {orderStatusType[orderStatus]}
                                </h1>
                                {
                                    this.renderOrderBtn()
                                }
                                <Button
                                    size="small"
                                    className="order-log__btn" type="primary" ghost onClick={this.toggleLogModal}
                                >操作日志</Button>
                            </div>
                        </div>
                    </section>
                    <section className="order-detail-info">
                        <h2 className="order-h2">订单信息</h2>
                        <CustomTable cols={2} dataSource={ORDER_INFO} />
                    </section>
                    <section className="order-detail-others">
                        <h2 className="order-h2">其他信息</h2>
                        <Tabs defaultActiveKey="1">
                            {
                                OTHER_INFO.map((item, index) => {
                                        if (item.tabName === '客人信息') {
                                            return (
                                                <TabPane
                                                    tab={item.tabName} key={index + 1}
                                                >
                                                    <Tabs defaultActiveKey={`${index + 1}-1`}>
                                                        {
                                                            item.dataSource.map((subItem, subIndex) => {
                                                                return (
                                                                    <TabPane size="small" tab={subItem.value} key={`${index + 1}-${subIndex + 1}`}>
                                                                        <CustomTable cols={item.cols} dataSource={subItem.dataSource} />
                                                                    </TabPane>
                                                                )
                                                            })
                                                        }
                                                    </Tabs>
                                                </TabPane>
                                            )
                                        } else if(item.tabName === '保单信息') {
                                            return (
                                                <TabPane
                                                    tab={item.tabName} key={index + 1}
                                                >
                                                    <SubTable {...subTableItem} />
                                                </TabPane>
                                            )
                                        } else {
                                            return (
                                                <TabPane
                                                    tab={item.tabName} key={index + 1}
                                                >
                                                    <CustomTable cols={item.cols} dataSource={item.dataSource} />
                                                </TabPane>
                                            )
                                        }
                                    }
                                )
                            }
                        </Tabs>
                    </section>
                </Drawer>
            ) : null
        )
    }
}
