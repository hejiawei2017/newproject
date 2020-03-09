import Ajax from '../utils/axios.js'

export default {
    getTable: (data) => {
        return Ajax.post('/fire/base-value/page-list', data)
    },
    getSelectList: (data) => {
        return Ajax.get('/fire/base-value/plan-type-city', data)
    },
    addBase: (data) => {
        return Ajax.post('/fire/base-value/add', data)
    },
    getBase: (data) => {
        return Ajax.get(`/fire/base-value/history/${data}`)
    }
}