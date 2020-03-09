import Ajax from '../utils/axios.js'

export default {
    getReportExportLogs: (data) =>{
        return Ajax.get('/report/report/export-logs', data) // 获取报表列表
    },
    postExportReport: (data) =>{
        return Ajax.post('/report/report/export', data) // 获取报表列表
    }
}