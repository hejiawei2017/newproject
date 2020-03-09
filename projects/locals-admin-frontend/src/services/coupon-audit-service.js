import Ajax from '../utils/axios.js'

export default {
    getReviews: data =>{
        return Ajax.get('/coupon/reviews',data)
    },
    putReviews: data =>{
        return Ajax.put('/coupon/review',data)
    }
}