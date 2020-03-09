import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/prod-plus/supplier', data)
    },
    del: (id)=>{
        return Ajax.delete(`/prod-plus/supplier/${id}`)
    },
    update: (data)=>{
        return Ajax.put(`/prod-plus/supplier`,data)
    },
    add: (data)=>{
        return Ajax.post('/prod-plus/supplier', data)
    }
}