import Ajax from '../utils/axios.js'

export default {
    getTable: (data) =>{
        return Ajax.get('/platform/users',data) // 获取用户列表
    },
    sendByAdmin: (data) =>{
        return Ajax.post('/3rd/im/sendByAdmin',data) //发送消息内容
    }
}