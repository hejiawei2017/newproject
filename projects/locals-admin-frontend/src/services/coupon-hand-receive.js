import Ajax from '../utils/axios.js'

export default {
    postReceiveCoupon: data => {
        return Ajax.post('/coupon/record/admin/receive-coupon', data)
    }
}
