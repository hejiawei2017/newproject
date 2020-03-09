import Ajax from '../utils/axios.js'
export default {
    getTable: (data) =>{
        return Ajax.get('/old/business/business-orders',data) // 获取table列表
    },
    getServiceOrder: (data) =>{
        return Ajax.get('/old/business/business-order/',data,true) // 获取详情接口
    },
    getRefundOrder: (data) =>{
        return Ajax.get('/old/business/business-order-logs',data) // 获取详情接口
    },
    cancelOrder: (data) =>{
        return Ajax.post('/old/business/business-order-refund',data) // 取消订单
    }
}