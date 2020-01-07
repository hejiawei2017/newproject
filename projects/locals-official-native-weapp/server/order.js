const request = require('../utils/request.js')

function createOrder (data) {
    return request.post('booking-plus/order', data)
}

function orderCalculate (data) {
    return request.post('booking-plus/order/calculate', data)
}

function newConsulting (data) {
    return request.post('booking-plus/order/new-consulting', data)
}

function payByCash(bookingId) {
    return request.put(`booking-plus/order/${bookingId}/pay_by_cash`)
}

function getOrderDetail(id) {
    return request.get(`booking-plus/order/${id}/detail`)
}

function bookingCalendar (data) {
    return request.get('prod-plus/booking-calendar/booking-price', data)
}

function miniPay (data) {
    return request.post('pay-center/pay', data)
}

/**
 * 获取保单列表信息，通过订单ID
 */
function getGuaranteeSlipList (orderId) {
    return request.get(`booking-plus/checkin/pa/${orderId}`)
}


function waitPay(data) {
  return request.get('mall/trade/wait-buyer-pay/item', data)
}

function wxPay(data) {
    return new Promise((resolve, reject) => {
        miniPay(data)
            .then(res => {
                let payParams = {
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: res.data.pkg,
                    signType: res.data.signType,
                    paySign: res.data.sign,
                    success: res => {
                        resolve && resolve(res)
                    },
                    fail: e => {
                        reject && reject(e)
                    }
                  }
                // 调起微信支付
                wx.requestPayment(payParams)
            })
            .catch(e => {
                reject && reject(e)
            })
    })
}

function getOrders (data) {
    // return request.get('booking-plus/order/orderList', data)
    return request.get('booking-plus/order/app/orderList', data)
}

function cancelBooking (data) {
    return request.put('booking-plus/order/cancel', data)
}

// 获取退款金额
function refundPrice(data) {
    return request.post('booking-plus/order/refund-price', data)
}
function refund(data) {
    return request.post('booking-plus/order/refund', data)
}
// 提交评论
function comment(data) {
    return request.post('prod-plus/comment', data)
}

function putCommentStatus (bookingId) {
    return request.put(`booking-plus/order/${bookingId}/comment`)
}

// 获取可用优惠券
function getAvailableCoupons (data) {
    return request.post('booking-plus/order/coupons', data)
    // return request.get('coupon/records/effective', data)
}

// 下单时不可用的优惠券
function getInvalidCoupons(data) {
    return request.get('coupon/records/invalid', data)
}

// 领取优惠券
function receiveCoupon(data) {
    return request.post('coupon/record/receive-coupon', data)
}
function cancelOrder(data) {
    return request.post('booking-plus/order/refund', data)
}

// 购买vip列表
function getBuyVipList() {
    return request.get('buy-vip/list NODE')
}

function getV2BuyVipList() {
  return request.get('buy-vip/v2/list NODE')
}

// 删除行程结束的订单（软删除后台可见）
function delTrip(bookingId) {
    return request.delete(`booking-plus/order/${bookingId}/soft`)
}

// 领取100元新人红包
function reciveRedpacket(params) {
    return request
    .post(`https://i.localhome.cn/api/new_use_redpacket/index`, params)
}

// 检查是否显示出会员升级模块
function checkMemberCard(params) {
    return request.get(`mall/trade/user/bought-member-card`, params)
}

module.exports = {
    orderCalculate,
    bookingCalendar,
    miniPay,
    createOrder,
    getOrders,
    getOrderDetail,
    cancelBooking,
    newConsulting,
    refundPrice,
    refund,
    comment,
    putCommentStatus,
    getAvailableCoupons,
    receiveCoupon,
    payByCash,
    cancelOrder,
    getInvalidCoupons,
    wxPay,
    waitPay,
    getBuyVipList,
    getV2BuyVipList,
    delTrip,
    getGuaranteeSlipList,
    reciveRedpacket,
    checkMemberCard
}