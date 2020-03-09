import Ajax from '../utils/axios.js'
export default {
    getTable: data =>{ // 获取会话列表
        return Ajax.get('/im/v2/sessions',data)
    },
    getContent: data =>{ //获取聊天内容
        return Ajax.get('/im/message',data)
    },
    getHouseDetail: id=>{//房源详情
        return Ajax.get(`/prod-plus/backstage/im/house-simple-info?houseSourceId=${id}`)
    },
    getSecretKey: data =>{//获取im秘钥信息
        return Ajax.get(`/im/init/info`,data)
    },
    getImUserInfo: (userId, appType) =>{//获取IM用户信息
        return Ajax.get(`/im/user/${userId}?appType=${appType}`)
    },
    sendMessage: data =>{//发送群组消息
        return Ajax.post(`/im/v2/message`, data)
    },
    receiveSession: id =>{//客服领取会话
        return Ajax.post(`/im/session/receive/${id}`)
    },
    delBatchData: data => {//批量删除客服未解决消息列表
        return Ajax.post(`/im/session/customer_service/batch_delete`, data)
    },
    sessionClose: id => {//关闭客服会话消息列表
        return Ajax.post(`/im/session/close/${id}`)
    },
    getOrderList: data => {//获取订单列表
        return Ajax.get(`/im/orders/page`, data)
    },
    findBookingDetailByBookingIdPlus: id => {//获取订单详情
        return Ajax.get(`/booking-plus/assist/order/${id}/detail`)
    },
    sendSpecialDiscount: params => {//发送特别优惠
        return Ajax.put('/booking-plus/assist/order/special',params)
    },
    agreeBooking: id => {//接受预定
        return Ajax.put('/booking-plus/assist/order/' + id + '/agree')
    },
    rejectBooking: id => {//拒绝预定
        return Ajax.put('/booking-plus/assist/order/' + id + '/reject')
    },
    setRead: data => {//设置消息为已读状态
        return Ajax.put('/im/message/set-read', data)
    },
    assistantOnline: sessionId => {//判断管家是否上线
        return Ajax.get(`/im/session/assistant_has_reply_message/${sessionId}`)
    }
}
