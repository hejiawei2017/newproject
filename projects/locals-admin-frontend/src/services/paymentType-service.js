import Ajax from '../utils/axios.js'

export default {
    getTable: (data) => {
        return Ajax.get('/opt/payment/payments', data)
    },
    editItem: (data) => {
        return Ajax.post('/opt/payment/updatePayment', data)
    }
    // getItem: (data) => {
    //     return Ajax.get(`/opt/payment/paymentType?id=${data}`)
    // },
    // deleteItem: (data) => {
    //     return Ajax.delete(`/act/ads/${data}`)
    // }
}