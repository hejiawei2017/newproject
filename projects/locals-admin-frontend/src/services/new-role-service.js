import Ajax from '../utils/axios.js'

export default {
    addRole: (payload) => Ajax.post('/platform/role', payload),
    editRole: payload => Ajax.put('/platform/role', payload),
    deleteRole: id => Ajax.delete(`/platform/role/${id}`),
    getTable: (data)=>{
        return Ajax.get('/platform/roles', data)
    },
    queryRoleCode: (roleCode)=>{
        return Ajax.get(`/platform/role-authorities/role-code/${roleCode}`)
    },
    delRoleCode: (id)=>{
        return Ajax.delete(`/platform/role-authorities/${id}`)
    },
    addAuthorities: (data)=>{
        return Ajax.get('/platform/authorities', data)
    },
    batchAuthorities: (data)=> {
        return Ajax.post('/platform/role-authorities/batch', data)
    }
}