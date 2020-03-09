import Ajax from '../utils/axios.js'

export default {
    getCouponList: data =>{
        return Ajax.get('/coupon/admin/records/',data)
    }
}