import Ajax from '../utils/axios.js'

export default {
    getFacilityDict: () =>{
        return Ajax.get('/prod-plus/house-dictionary/facility') // 获取设施字典
    },
    getFacilityInfo: (houseId) =>{
        return Ajax.get(`/prod-plus/aai/house/${houseId}/facilities`) // 获取设施信息, 待修改
    },
    putFacilityInfo: (houseId,data) =>{
        return Ajax.put(`/prod-plus/aai/house/${houseId}/facility`,data) // 修改设施信息, 待修改
    },
    getRuleInfo: (houseId)=>{
        return Ajax.get(`/prod-plus/aai/house/${houseId}/rule`) // 获取房屋规则, 待修改
    },
    putRuleInfo: (houseId,data)=>{
        return Ajax.put(`/prod-plus/aai/house/${houseId}/rule`,data) // 修改房屋规则, 待修改
    },
    getProgress: (houseId)=>{
        return Ajax.get(`/prod-plus/aai/house/${houseId}/check`) // 获取进度, 待修改
    },
    getMemberInfo: (houseId)=>{
        return Ajax.get(`/prod-plus/aai/house/${houseId}/member`) // 获取人员信息
    },
    putMemberInfo: (houseId,data)=>{
        return Ajax.put(`/prod-plus/aai/house/${houseId}/member`,data) // 修改人员信息
    },
    getCleanerList: (houseSourceId)=>{
        return Ajax.get(`/cleaning/${houseSourceId}/street/cleaners`) // 获取保洁员信息
    },
    getDesignerInfo: (phone)=>{
        return Ajax.get(`/contract/talents/getTalentsList?phone=${phone}`) // 获取设计师人员信息
    },
    getLandLord: (houseSourceId,id)=>{
        return Ajax.get(`/prod-plus/house-source/${houseSourceId}/landlord/${id}`) // 获取房东信息，没有文档
    },
    putLandLord: (data)=>{
        return Ajax.put(`/prod-plus/house-source/landlord`,data) // 修改房东信息，没有文档，请求体是getLandLord返回的减少了version和timeVersion
    },
    getBookingSetting: (houseId)=>{
        return Ajax.get(`/prod-plus/aai/house/${houseId}/booking-setting`) // 获取预定信息
    },
    putBookingSetting: (houseId,data)=>{
        return Ajax.put(`/prod-plus/aai/house/${houseId}/booking-setting`,data) // 修改预定信息
    },
    getSyncStatus: (houseId)=>{
        return Ajax.get(`/prod-plus/aai/house/${houseId}/sync-status`) // 获取上线状态
    },
    getExtend: (houseId)=>{
        return Ajax.get(`/prod-plus/aai/house/${houseId}/extend`) // 获取上线必填项
    },
    putExtend: (houseId,data)=>{
        return Ajax.put(`/prod-plus/aai/house/${houseId}/extend`,data) // 修改上线必填项
    },
    getSyncLogs: (houseId,{ platform = 'locals',pageSize = 10, pageNum = 1 })=>{
        return Ajax.get(`/prod-plus/aai/house/${houseId}/sync-log/${platform}?pageSize=${pageSize}&&pageNum=${pageNum}`) // 获取上线状态记录
    },
    getSyncCalendarInfo: (houseSourceId)=>{
        return Ajax.get(`/prod-plus/airbnb/airbnb-extend/${houseSourceId}`) // 获取日历同步信息
    },
    postRemoveSyncCalendar: (houseSourceId,data = {})=>{
        return Ajax.post(`/prod-plus/airbnb/calendar/remove/${houseSourceId}`,data) // 清除同步
    },
    putSyncCalendarInfo:(data)=>{
        return Ajax.put(`/prod-plus/airbnb/airbnb-extend`,data) // 更新同步信息
    },
    postPublish: (houseId)=>{
        return Ajax.post(`/prod-plus/aai/house/${houseId}/publish`) // del发布del审核房源
    }

}
