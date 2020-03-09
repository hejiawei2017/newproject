import Ajax from '../utils/axios.js'

export default {
    getPaymentDetailsWallet: (data) =>{
        return Ajax.get('/opt/accounting/payment-details-wallet', data) // 获取钱包明细
    },
    getPaymentTypeList: () => {
        return Ajax.get('/opt/accounting/payment-type-list') // 获取支付类型列表
    },
    getBooking: id => {
        return Ajax.get(`/opt/accounting/booking/${id}`)
    },
    getLogs: (data) => {
        return Ajax.get('/opt/logs', data)
    },
    getOrderNo: (id) => {
        return Ajax.get(`/booking-plus/system/order/${id}`)
    }
}