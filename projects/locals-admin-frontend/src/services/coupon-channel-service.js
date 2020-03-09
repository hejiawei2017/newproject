import Ajax from '../utils/axios.js'

export default {
    getChannelList: data => {
        return Ajax.get('/coupon/coupon-channels', data)
    },
    postChannel: data => {
        return Ajax.post('/coupon/channel/', data)
    },
    putChannel: data => {
        return Ajax.put('/coupon/channel/', data)
    },
    deleteChannel: id => {
        return Ajax.delete(`/coupon/channel/${id}`)
    }
}