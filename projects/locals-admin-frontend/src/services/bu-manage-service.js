import Ajax from '../utils/axios.js'

export default {
    getBuList: (data) => {
        // 获取Bu列表
        return Ajax.post('/old/bus', data)
    },
    getBuDetails: (data) => {
        // 获取Bu详情
        return Ajax.get(`/old/bu/${data}`)
    },
    addBu: (data) => {
        // 新增Bu
        return Ajax.post('/old/bu', data)
    },
    editBu: (data) => {
        // 修改Bu
        return Ajax.put('/old/bu', data)
    },
    deleteBu: (data) => {
        // 删除Bu
        return Ajax.delete(`/old/bu/${data}`)
    },
    records: (data) => {
        return Ajax.get(`/old/bu-operate-records`, data)
    },
    getBuChangeLog:data=>Ajax.get(`/old/bu-change-log`,data),
    //导出运营报表
    reportDboExcel: (data,filename) => Ajax.formGet(`/report/dbo-report/excel?${data}`,filename)
}
