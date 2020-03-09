import Ajax from '../utils/axios.js'
export default {
    getTable: (data) =>{
        return Ajax.get('/platform/organizations',data)
    },
    addTree: (data) =>{
        return Ajax.post('/platform/organization',data)
    },
    putTree: (data) =>{
        return Ajax.put('/platform/organization',data)
    },
    deleteTree: (id) =>{
        return Ajax.delete(`/platform/organization/${id}`)
    }
}