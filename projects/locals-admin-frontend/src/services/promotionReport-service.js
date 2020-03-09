import Ajax from '../utils/axios.js'

export default {
    getPromotionTable: (data)=>{
        // 获取推广渠道列表
        return Ajax.get('/platform/promotion/channel', data)
    },
    getDeapartmentTable: (data) => {
        // 查询部门列表
        return Ajax.get('/platform/promotion/department', data)
    },
    getGroup: (data) => {
        // 查询分组
        return Ajax.get('/platform/promotion/group', data)
    },
    // 查询注册人数
    getRigisterNum: (data) => {
        return Ajax.get('/platform/promotion/report/sign', data)
    },
    // 注册明细
    getRigisterDetail: (data) => {
        return Ajax.get('/platform/promotion/report/sign-detail', data)
    },
    // 订单统计
    getOrderList: (data) => {
        return Ajax.get('/prod/promotion/report/booking', data)
    },
    getOrderDetail: (data) => {
        return Ajax.get('/prod/promotion/report/booking-detail', data)
    }
    // 订单明细
}