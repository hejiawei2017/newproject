import Ajax from '../utils/axios.js'
export default {
    getTable: (data) => {
        return Ajax.get('/prod-plus/backstage/house-area-role', data)
    },
    fetchOrganizations: (data) =>{
        return Ajax.get('/platform/organizations', data)
    },
    fetchPositions: (data) =>{
        return Ajax.get('/platform/positions', {...data})
    },
    fetchUserSimpleInfo: (data) =>{
        return Ajax.get('/platform/user/user-simple-info', data)
    },
    fetchHouseRole: (data) =>{
        return Ajax.put('/prod-plus/house/house-role', data)
    },
    fetchBatchEditHouseBu: (data) =>{
        return Ajax.put('/prod-plus/house/house-bu', data)
    },
    fetchBatchEditHouseAssist: (data) =>{
        return Ajax.put(`/prod-plus/house/house-assist?originAssistId=${data.originAssistId}&newAssistId=${data.newAssistId}`)
    },
    fetchHouseRoleLogs: (data) =>{
        return Ajax.get('/prod-plus/house/house-role-logs', data)
    },
    fetchHouseRoleUser: (data) =>{
        return Ajax.get('/platform/employee-biz', data)
    },
    fetchRefreshSystem: (data) =>{
        return Ajax.post('/prod-plus/backstage/house-area-role/refresh')
    }

}
