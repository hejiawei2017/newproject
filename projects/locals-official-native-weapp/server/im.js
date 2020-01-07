const request = require('../utils/request.js')

function getImOrderDetail(id) {
    return request.get(`im/order/${id}/detail`)
}
function getOrderDetail(id) {
    return request.get(`booking-plus/order/${id}/detail`)
}
function getImOrderInfo(id) {
    // 获取订单信息
    return request.get(`im/order/${id}`)
}
function getImInitInfo() {
    // 获取初始化信息
    return request.get(`im/init/info`)
}
function getMeMessagesList(data) {
    // 获取列表信息
    return request.get(`im/message`, data)
}
function getMessagesList(data) {
    // 获取列表信息
  return request.get(`im/booking/sessions`, data)
}
function getLoginInfo(id) {
    // 获取初始化信息
    return request.get(`im/user/${id}`)
}
function postSendMessage(data) {
    // 发送消息
    return request.post(`im/v3/message`, data)
}
function getMessageTotalUnread() {
    // 发送消息
    return request.get(`im/booking/message/unread-count`)
}
// 获取动态groupId
function getDynamicGroupId(sessionId) {
    return request.get(`im/session/${sessionId}/jmessage/group/id`)
}

module.exports = {
    getImOrderDetail,
    getOrderDetail,
    getImOrderInfo,
    getImInitInfo,
    getMeMessagesList,
    getMessagesList,
    getLoginInfo,
    postSendMessage,
    getMessageTotalUnread,
    getDynamicGroupId
}