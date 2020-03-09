import Ajax from '../utils/axios.js'
export default {
    getTable: (data) =>{
        // return Ajax.get('/old/business/business-activitys',data) // 获取table列表
        return Ajax.get('/old/business/business-activitys',data) // 获取table列表
    },
    statusServiceItem: (data) =>{
        return Ajax.post('/old/business/business-activity-log',data) // 暂停接口和审核
    },
    delServiceItem: (data) =>{
        return Ajax.delete('/old/business/business-activity-service/',data,true) // 删除接口
    },
    getIncrementDetail: (data) =>{
        return Ajax.get('/old/business/business-activity',data,true) // 获取详情接口
    },
    getServiceList: (data) =>{
        return Ajax.get('/old/business/business-services',data) // 获取服务项目接口
    },
    getProviderList: (data) =>{
        return Ajax.get('/old/business/business-providers?pageSize=9999',data) //获取服务商接口
    },
    linkProviderList: (data) =>{
        return Ajax.get('/old/business/business-service-provider',data) // 关联服务商接口
    },
    getLogList: (data) =>{
        return Ajax.get('/old/business/business-activity-log?',data) //获取审核记录接口
    },
    updateServiceList: (data) =>{
        return Ajax.put('/old/business/business-activity',data) // 编辑服务项目接口
    },
    addServiceList: (data) =>{
        return Ajax.post('/old/business/business-activity',data) // 新增服务项目接口
    }
}