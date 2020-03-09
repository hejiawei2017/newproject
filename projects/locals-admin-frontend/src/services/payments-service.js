import Ajax from '../utils/axios.js'

export default {
    getPaymentDetails: (data) => {
        return Ajax.get('/opt/accounting/payment-details', data)
    },
    confirmAirbnbPay: (id) => {
        // 手动修正bnb订单类型
        return Ajax.post(`/opt/accounting/payment-detail/${id}/manual-confirm-airbnb-pay-type`)
    },
    manualConfirm: (id) => {
        // 手动确认到账
        return Ajax.post(`/opt/accounting/payment-detail/${id}/manual-confirm`)
    }
}