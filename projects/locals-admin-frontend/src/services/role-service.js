import Ajax from '../utils/axios.js'

export default {
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
    batchAuthorities: (data)=>{
        return Ajax.post('/platform/role-authorities/batch',data)
    }
}