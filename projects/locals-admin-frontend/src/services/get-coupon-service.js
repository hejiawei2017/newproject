import Ajax from '../utils/axios.js'

export default {
    pickUP: (data) => {
        return Ajax.post('/coupon/record/receive', data)
    }
}