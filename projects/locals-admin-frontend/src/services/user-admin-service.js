import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/platform/users', data)
    },
    queryUserId: (id)=>{//http://uat.localhome.cn/api/platform/user-roles/user-id/929958907538182587
        return Ajax.get(`/platform/user-roles/user-id/${id}`)
    },
    delUserCode: (id)=>{//http://uat.localhome.cn/api/platform/user-roles/994571962722697216
        return Ajax.delete(`/platform/user-roles/${id}`)
    },
    addUser: (data)=>{//http://uat.localhome.cn/api/platform/roles?excludeRoleCodes=ROLE_USER&pageSize=1000
        return Ajax.get('/platform/roles', data)
    },
    batchUser: (data)=>{//http://uat.localhome.cn/api/platform/user-roles/batch
        return Ajax.post('/platform/user-roles/batch',data)
        //[roleCode:"ROLE_USER"roleName:"普通用户"userId:"929958907538182587"]
    },
    refreshTimeout: (data)=>{//http://uat.localhome.cn/api/platform/user-roles/batch
        return Ajax.put('/platform/user/refresh-timeout',data)
        //{ "mobile":"13594087915"}
    },
    userLoginLogs: (data)=>{
        return Ajax.get('/platform/user-login-logs',data)
    }
}