import Ajax from '../utils/axios.js'
export default {
    getTable: (data) =>{
        return Ajax.get('/prod/manage-bookings',data) // 获取订单列表
    },
    orderDissent: (data) =>{
        return Ajax.post('/prod/booking-dissent/booking-dissent',data,true) //处理歧义
    },
    orderCancel: (data) =>{
        return Ajax.post('/prod/booking/cancel-booking',data,true) //取消订单
    },
    getInvoiceInfo: (id) =>{
        return Ajax.get(`/booking-plus/invoice/booking/${id}`) // 根据订单ID获取发票详情
    },
    getCalInvoicePrice: (data) =>{
        return Ajax.get(`/prod/booking/calInvoicePrice`, data) // 总退款金额 计算
    },
    getSurplusInvoicePrice: (id) =>{
        return Ajax.put(`/booking-plus/invoice/surplus-invoice-price`) // 更改剩余开票金额
    },
    setTuJiaApiOrder: (data) => {
        // 修改API订单
        return Ajax.post('/old/old/booking/tujia-api/migrate', data)
    },
    delTuJiaApiOrder: (data) => {
        // 删除途家API订单
        return Ajax.post('/old/old/booking/tujia-api/delete', data)
    },
    getCitylist: (data) => {
        // 查询城市列表
        return Ajax.get(`/base/china-areas`, data)
    },
    getfestivalData: () => {
        return Ajax.get('/coupon/holiday-config') //获取假日列表
    }
}
