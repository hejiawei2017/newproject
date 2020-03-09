import Ajax from '../utils/axios.js'

export default {
    // getTable: (data) =>{
    //     return Ajax.get('/booking-plus/admin/orders/maneage/',data) // 获取订单列表
    // },
    getOrderList: payload => Ajax.get('/booking-plus/admin/orders/manage',payload),

    getOrderDetail: id => {
        return Ajax.get(`/booking-plus/admin/order/message/${id}/detail`)
    },
    getRecommendationRefund: payload => Ajax.get('/booking-plus/admin/order/invoiceServicePrice', payload),
    getOperationLogs: payload => Ajax.get('/booking-plus/operation/log', payload),
    setDepositFrozen: payload => Ajax.post(`/booking-plus/admin/bookings/frozen-booking`, payload),
    setDepositUnfrozen: (payload) => Ajax.post(`/booking-plus/admin/order/deposit`, payload),
    cancelOrder: payload => Ajax.post(`/booking-plus/admin/order/refund-customer`, payload),
    orderDissent: (data) =>{
        return Ajax.post('/prod/booking-dissent/booking-dissent',data) //处理歧义
    },
    orderCancel: (data) =>{
        return Ajax.post('/prod/booking/cancel-booking',data) //取消订单
    },
    getInvoiceInfo: (id) =>{
        return Ajax.get(`/booking-plus/invoice/booking/${id}`) // 根据订单ID获取发票详情
    },
    getCalInvoicePrice: (data) =>{
        return Ajax.get(`/prod/booking/calInvoicePrice`, data) // 总退款金额 计算
    },
    getSurplusInvoicePrice: (id) =>{
        return Ajax.put(`/booking-plus/invoice/surplus-invoice-price`) // 更改剩余开票金额
    },
    getCityList: payload => Ajax.get('/base/china-areas', payload),
    //取消API订单
    orderCloseTuJia: (data) => {
        return Ajax.put('/booking-plus/admin/bookings/api_order/cancel',data)
    },
    //修改API订单
    orderEditTuJia: (data) => {
        return Ajax.put('/booking-plus/admin/bookings/api_order/update',data)
    },
    //修改API订单、手工单（路客收款和非路客收款）
    orderEdit: (data) => {
        return Ajax.put('/booking-plus/admin/order/update',data)
    },
    //关闭订单
    orderClose: (data) => {
        return Ajax.put('/booking-plus/admin/bookings/order/close',data)
    },
    //取消手工订单
    handOrderCancel: (data) => {
        return Ajax.put(`/booking-plus/admin/order/cancel?orderId=${data}`)
    },
    //同步
    synchroHouse: (data) => {
        return Ajax.put('/booking-plus/admin/bookings/order/synchro_house_source',data)
    },
    //修改订单时间
    changeDate: (data) => {
        return Ajax.put('/booking-plus/admin/bookings/order/change_order_date',data)
    },
    //检查订单时间
    checkOrderDate: (houseSourceId,data) => {
        return Ajax.get(`/prod-plus/house/${houseSourceId}/calendar/stock/check`,data)
    },
    //通过订单查保单
    getPolicyTable: (data) => {
        return Ajax.get(`/booking-plus/checkin/pa/${data.orderNo}`,)
    },
    //获取lotel订单排房信息
    getOrderlotels: (data) => {
        return Ajax.get(`/booking-plus/orderlotels`,data)
    },
    //lotel订单排房
    saveOrderLotel: (data) => {
        return Ajax.post(`/booking-plus/orderlotel/save`,data)
    },
    //lotel订单重排房
    updateOrderLotel: (data) => {
        return Ajax.put(`/booking-plus/orderlotel/update`,data)
    },
    //lotel订单发送密码
    sendPassword: (orderLotelId) => {
        return Ajax.put(`/booking-plus/orderlotel/sendpwd?orderLotelId=${orderLotelId}`)
    },
    //查询可用房号
    getroomlist: (data) => {
        return Ajax.get(`/prod-plus/pms/house/room-number/available`,data)
    },
    postPolicyNoPay: (data) => {
        return Ajax.post(`/booking-plus/checkin/pa/apply-batch-policy-no-pay`, data)
    },
    //修改订单接口
    orderEditUpdate: (data) => {
        return Ajax.put('/booking-plus/admin/order/update',data)
    }
}
