const request = require('../utils/request.js')

function getOrderList () {
    return request.get(`booking-plus/order/orders?pageSize=10000000`)
}

function tradeOrder (data) {
    return request.post('platform/member-service-order/app', data)
}

function getTradeLog (data) {
    return request.get('platform/member-service-order/by-criteria', Object.assign({}, data, {
        pageSize: 10000000
    }))
}

function getServiceTypes (data) {
    return request.get('platform/member-service-order/available/info', data)
}

function getBuinessInfo (data) {
    return request.get('platform/cash-vip/user-id', data)
}

function sendCodeEmail (data) {
    return request.post('platform/validation/sent-mail', data)
}

function checkCodeEmail (data) {
    return request.put('platform/validation/check-mail', data)
}

function createVip (data) {
    return request.post('platform/cash-vip', Object.assign({}, {
        changeMode: '2',
        vipType: '1',
    }, data))
}

function sendCoupon (data) {
    return request.post('coupon/record/admin/receive-coupon', data)
}

/**
 * 获取会员可用服务类型及数量
 * @param {*} data {memberId：会员id}
 */
function getAvailableServiceOrder(data) {
    return request.get('platform/member-service-order/available', data)
}

module.exports = {
    getOrderList,
    tradeOrder,
    getTradeLog,
    getServiceTypes,
    getBuinessInfo,
    sendCodeEmail,
    checkCodeEmail,
    createVip,
    sendCoupon,
    getAvailableServiceOrder
}