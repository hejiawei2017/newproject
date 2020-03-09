import Ajax from '../utils/axios.js'
export default {
    getRuleTable: data =>{
        if(data){
            return Ajax.get('/coupon/rules', data)
        }else{
            return Ajax.get('/coupon/rules?pageSize=10000', data)
        }
    },
    getCouponTable: data => {
        return Ajax.get('/coupon/coupon/list/page/', data)
    },
    putMoneyRule: data =>{
        return Ajax.post('/coupon/rule/',data)
    },
    deleteRule : id =>{
        return Ajax.delete(`/coupon/rule/${id}`)
    },
    getOneRule : id =>{
        return Ajax.get(`/coupon/rule/${id}`)
    },
    putRule: data =>{
        return Ajax.put('/coupon/rule/',data)
    },
    getCouponList : data =>{
        if(data){
            return Ajax.get('/coupon/coupons', data)
        }else{
            return Ajax.get('/coupon/coupons?pageSize=99999',data)
        }
    },
    getValidCouponList : data =>{
        return Ajax.get('/coupon/valid-coupons', data)
    },
    getUserList : data =>{
        return Ajax.get('/coupon/user-labels',data)
    },
    getChannelList : data => {
        return Ajax.get('/coupon/coupon-channels',data)
    },
    getHouseTagList : data => {
        return Ajax.get('/prod-plus/customer/tag/list',data)
    },
    postCoupon : data =>{
        return Ajax.post('/coupon',data)
    },
    deleteCoupon : id=>{
        return Ajax.delete(`/coupon/${id}`)
    },
    CouponRedemption : data =>{
        return Ajax.get('/coupon/admin/records/',data)
    },
    editCoupon : data=>{
        return Ajax.put('/coupon/',data)
    },
    getTest : data=>{
        return Ajax.post('/coupon/express/test',data)
    },
    deleteRecord : id=>{
        return Ajax.delete(`/coupon/record/${id}`)
    },
    takeEffect : id=>{
        return Ajax.put(`/coupon/take-effect/${id}`)
    }
}
