import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/platform/page/permissions', data)
    },
    del: (id)=>{
        return Ajax.delete(`/platform/permission/${id}`)
    },
    update: (data)=>{
        return Ajax.put(`/platform/permission`,data)
    },
    add: (data)=>{
        return Ajax.post('/platform/permission', data)
    },
    fetch: ()=>{
        return Ajax.put('/platform/permission/refresh')
    },
    platform: (data) =>{
        return Ajax.get('/platform/permission-modules',data)
    }
}