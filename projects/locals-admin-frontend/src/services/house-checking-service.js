import Ajax from '../utils/axios.js'

export default {
    getTable: (data) =>{
        return Ajax.get('/prod-plus/house/report',data) // 获取table列表
    },
    houseImage: (data) =>{
        return Ajax.get(`/prod-plus/house/${data}/images`,"",true) // 获取图片数据
    },
    houseDetail: (data) =>{
        return Ajax.get(`/prod-plus/backstage/house/${data}/audit/detail`) //获取房源审批详情
    },
    getFacilities:(data) =>{
        return Ajax.get(`/prod-plus/house/${data}/facilities`)//获取便利设施，无用
    },
    getAllFacil: (data) =>{
        return Ajax.get('/prod-plus/house-dictionary/facility',data)//获取全部的便利设施
    },
    getAuditLog: (data) =>{
        return Ajax.get(`/prod-plus/backstage/house/${data}/audit/log`) //房源审批日志
    },
    putAudit: (id,status,through) =>{
        return Ajax.put(`/prod-plus/backstage/house/${id}/audit?status=${status}&description=${through}`) //提交审核
    },
    getAdress: (data) => {
        return Ajax.get(`https://restapi.amap.com/v3/geocode/regeo?${data}`) //房源审批日志
    }
}
