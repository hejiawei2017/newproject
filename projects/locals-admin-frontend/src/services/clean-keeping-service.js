import Ajax from '../utils/axios.js'

export default {
    //获取保洁人员列表
    getStaffTable: (data)=>{
        return Ajax.get('/cleaning/admin/cleaners', data)
    },
    getStaffAuditTable: (data)=>{
        return Ajax.get('/cleaning/admin/audit/cleaners', data)
    },
    getStaffIdCardImage: (data)=>{
        return Ajax.get(`/cleaning/admin/cleaner-idCard-image/${data}`)
    },
    updateStaffAudit: (data) => {
        return Ajax.post('/cleaning/admin/check-cleaner-verified', data)
    },
     //更新保洁人员状态
    updateStaffStatus: (data) => {
        return Ajax.post('/cleaning/admin/status-cleaner', data)
    },
    //审批保洁人员信息
    auditStaffCleaner: (data) => {
        return Ajax.post('/cleaning/admin/audit-cleaner', data)
    },
    //获取家政公司列表
    getCorporationTable : (data) => {
        return Ajax.get('/cleaning/admin/companies', data)
    },
    getCorporationImage : (data) => {
        return Ajax.get(`/cleaning/admin/${data}/audit-image`)
    },
    //更新家政公司状态
    updateCorporationStatus: (data) => {
        return Ajax.post('/cleaning/admin/status-company', data)
    },
    //资格认证通过
    auditCorporation: (data) => {
        return Ajax.post('/cleaning/admin/audit-company', data)
    },
    //资格认证详情
    getCorporationAuditDetail: (data) => {
        return Ajax.get(`/cleaning/admin/${data}/company-audit-detail`)
    },
    //订单列表
    getOrderTable: (data)=>{
        return Ajax.get('/cleaning/admin/orders', data)
    },
    getOrderDetail: (data) => {
        return Ajax.get(`/cleaning/admin/${data}/order-detail`)
    },
    getOrderCleanStaffDetail: (data) => {
        return Ajax.get(`/cleaning/admin/${data}/cleaner/basic-info`)
    },
    getHouseCleanTable: (data) => {
        return Ajax.get(`/cleaning/house/clean-fee/${data}`)
    },
    addSubmitHouseCleanFee: (data) => {
        return Ajax.post(`/cleaning/house/clean-fee`, data)
    },
    editSubmitHouseCleanFee: (data) => {
        return Ajax.put(`/cleaning/house/clean-fee`, data)
    },
    getCleanRules: (data) => {
        return Ajax.get(`/cleaning/rules`)

    }

}
