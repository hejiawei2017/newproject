import Ajax from '../utils/axios.js'

export default {
    getPlan: (data) => {
        // 计划经营报表
        return Ajax.post('/fire/new-operate-report-plan', data)
    },
    getReport: (data) => {
        // 房源经营报表
        return Ajax.post('/fire/new-operate-report-house-source', data)
    },
    getPayment: (data) => {
        // 收支明细
        return Ajax.post('/fire/syn/receipt-payment-detail', data)
    },
    getReceipt: (data) => {
        // 流程及票据
        return Ajax.get(`/fire/syn/flow-receipt/${data}`)
    }
}