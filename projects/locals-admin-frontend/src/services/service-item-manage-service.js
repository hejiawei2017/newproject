import Ajax from '../utils/axios.js'
export default {
    getTable: (data) =>{
        return Ajax.get('/old/business/business-services',data) // 获取table列表
    },
    statusServiceItem: (data) =>{
        return Ajax.put('/old/business/business-service-status',data) // 停用接口接口
    },
    getServiceItem: (data) =>{
        return Ajax.get('/old/business/business-service-Detail',data,true) // 获取详情接口
    },
    addServiceItem: (data) =>{
        return Ajax.post('/old/business/business-service',data) // 增加接口
    },
    updateServiceItem: (data) =>{
        return Ajax.put('/old/business/business-service',data,true) // 更新接口
    },
    getArea: (data) =>{
        return Ajax.get('/base/china-areas?pageSize=4000&existCity=false',data) // 城市接口
    },
    // getArea: (data) =>{
    //     return Ajax.get('http://ms.localhome.cn/api/base/china-areas?pageSize=4000&existCity=false',data) // 城市接口
    // },
    getCity: (data) =>{
        return Ajax.get('/old/business/business-provider-areas?kindcode=90',data) // tianjing接口
    },
    getProviderList: (data) =>{
        return Ajax.get('/old/business/business-providers',data) // 关联服务商接口
    },
    submitTemplate: (data) =>{
        return Ajax.post('/old/business/business-service-template',data) // 提交模版
    },
    updateTemplate: (data) =>{
        return Ajax.put('/old/business/business-service-template',data) // 更新模版
    },
    // updateTemplate: (data) =>{
    //     return Ajax.put('http://192.168.0.182:7012/business/business-service-template',data) // 更新模版
    // },
    delTemplate: (data) =>{
        return Ajax.delete('/old/business/business-service-template',data,true) // 删除模版
    }
}