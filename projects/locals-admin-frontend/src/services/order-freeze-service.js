import Ajax from '../utils/axios.js'
export default {
    getFreezeStatus: (data) => {
        // 计划经营报表
        return Ajax.post(`/prod-plus/tujia/order/deposit-status/${data.id}`)
    },
    postFreezeStatus: (data) => {
        // 计划经营报表
        return Ajax.post(`/prod-plus/tujia/order/deposit`, data)
    }
}