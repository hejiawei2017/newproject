import Ajax from '../utils/axios.js'

export default {
    getTable: (data) => {
        return Ajax.get('/booking-plus/invoice/list/page', data)
    },
    getDetail: (data) => {
        return Ajax.get(`/booking-plus/invoice/${data}`)
    }
}