import Ajax from '../utils/axios.js'

export default {
    getCityList: data => {
        return Ajax.get('/base/china-areas', data)
    },
    putHouseHeat: data => {
        return Ajax.put('/base/china-area', data) //城市热门房源切换
    },
    postHouseHeat: data => {
        return Ajax.post('/prod/house-source-locals-hots', data)
    },
    deleteHouseHeat: data => {
        return Ajax.delete('/prod/house-source-locals-hots/house-source-ids', data)
    },
    hotManage: data => {
        return Ajax.get(`/prod/house/hot-manage`, data)
    },
    updateHeatHouse: data => {
        return Ajax.put(`/prod/house-source-locals-hot`, data)
    },
    immediateEffect: data => {
        return Ajax.put(`/prod/house-source-locals-hots/poll-hot`, data)
    }
}