import Ajax from '../utils/axios.js'

export default {
    getPaymentExemptDeposit: (data) =>{
        return Ajax.get('/platform/exempt/deposit', data) // 申请列表
    },
    getPaymentManageActivity: (data) =>{
        return Ajax.get('/platform/members/manage/activity', data) // 活动数据导出
    },
    putPaymentExemptDeposit: (data) => {
        return Ajax.put('/platform/exempt/deposit', data) // 免押金审核
    },
    putPaymentExemptManage: (data) => {
        return Ajax.put('/platform/members/manage', data) // 免押金审核
    },
    getBooking: id => {
        return Ajax.get(`/opt/accounting/booking/${id}`)
    },
    getMembersManage: data => {
        return Ajax.get(`/platform/members/manage`, data)
    },
    getBookingDetails: data => {
        return Ajax.get(`/prod/booking/booking-details`, data, true)
    },
    getRankRecord: id =>{ //等级变更记录
        return Ajax.get(`/platform/membership-records?userId=${id}`)
    },
    getGivingRecord: id=>{ //赠送记录
        return Ajax.get(`/platform/consumption-of-gold-records?userId=${id}`)
    },
    getTimeLine: id=>{//权益时间线
        return Ajax.get(`/platform/equity-timelines?userId=${id}`)
    },
    putMember: data => {
        return Ajax.put('/platform/member',data) // 升级会员
    },
    getCouponList: data => {//获取优惠卷
        return Ajax.get(`/coupon/admin/records/`,data)
    },
    getOrderNo: (id) => {
        return Ajax.get(`/booking-plus/system/order/${id}`)
    }
}