import Ajax from '../utils/axios.js'

export default {
    getReplys: data => {
        return Ajax.get('/wechat/replys', data) // 获取客服消息
    },
    getReply: id => {
        return Ajax.get(`/wechat/reply/get/${id}`) // 获取一条客服消息
    },
    addReplys: data => {
        return Ajax.post('/wechat/reply', data) // 新增客服消息
    },
    postMessage: data => {
        return Ajax.post('/wechat/message', data)
    },
    getMessages: data => {
        return Ajax.get('/wechat/messages', data)
    },
    getMessagesDetail: (id, data) => {
        return Ajax.get(`/wechat/messages/${id}`, data)
    }
}