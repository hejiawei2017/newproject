import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/platform/authorities', data)
    },

    addAuthority: payload => Ajax.post('/platform/authority', payload),

    editAuthority: payload => Ajax.put('/platform/authority', payload),

    deleteAuthority: id => Ajax.delete(`/platform/authority/${id}`)
}