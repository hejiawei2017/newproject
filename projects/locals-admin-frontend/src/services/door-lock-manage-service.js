import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/prod-plus/house-door-lock-list', data)
    },
    fetchOpenLockLogTable: (data) => {
        return Ajax.get('/3rd-plus/third/go-lock/open-lock-his', data)
    },
    fetchSendPasswordRecordTable: (data) => {
        return Ajax.get(`/3rd-plus/third/go-lock/${data.lockNo}/pwd-send-record`, data)
    },
    fetchDoorLockDynamicPwd: (data) => {
        return Ajax.get(`/3rd-plus/third/go-lock/${data.lockNo}/dynamic-pwd`, data)
    },
    sendDoorLockPassword: (data) => {
        return Ajax.get(`/prod-plus/send-order-door-pwd`, data)
    },
    sendDoorLockAwapPassword: (data) => {
        return Ajax.get(`/3rd-plus/third/go-lock/send-offline-pwd`, data)
    },
    del: (data) => {
        return Ajax.delete(`/3rd-plus/third/go-lock/delete-pwd?lockNo=${data.lockNo}&pwdNo=${data.pwdNo}`)
    }
}