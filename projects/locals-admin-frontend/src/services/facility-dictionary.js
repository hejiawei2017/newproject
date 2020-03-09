import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/prod-plus/house-dictionaries', data)
    },
    del: (id)=>{
        return Ajax.delete(`/prod-plus/house-dictionary/${id}`)
    },
    update: (data)=>{
        return Ajax.put(`/prod-plus/house-dictionary`,data)
    },
    add: (data)=>{
        return Ajax.post('/prod-plus/house-dictionary', data)
    },
    getDictionaryCategory: (data)=>{
        return Ajax.post('/prod-plus/house-dictionary/category', data)
    }
}