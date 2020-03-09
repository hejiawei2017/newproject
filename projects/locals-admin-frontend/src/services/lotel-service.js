import Ajax from '../utils/axios.js'

export default {
    getTable: (data) => {
        return Ajax.get('/prod-plus/lotel-store', data)
    },
    getDetail: (data) => {
        return Ajax.get(`/prod-plus/lotel-store/${data}`)
    },
    addLotel: (data) => {
        return Ajax.post('/prod-plus/lotel-store', data)
    },
    editLotel: (data) => {
        return Ajax.put('/prod-plus/lotel-store', data)
    },
    getLotelNo: (data) => {
        return Ajax.get('/old/lotel-no')
    }
}
