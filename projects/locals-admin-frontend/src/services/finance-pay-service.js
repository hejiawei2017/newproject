import Ajax from '../utils/axios.js'
export default {
    getPayTypeList: (data)=>{
        // 支付类型
        return Ajax.get('/opt/accounting/payment-type-list', data)
    },
    postPaymentsImport: (data)=>{
        // 保存 支付宝汇款 导入数据
        return Ajax.post('/opt/accounting/payments-import', data)
    },
    postDirectImport: (data)=>{
        // 保存 钱包款项 导入数据
        return Ajax.post('/opt-plus/direct-payments-import', data)
    },
    postClearImport: (data)=>{
        // 保存 钱包款项 导入数据
        return Ajax.post('/opt/accounting/clear-payments-import', data)
    },
    getPayBatchesList: (data)=>{
        // 汇款批次列表
        return Ajax.get('/opt/accounting/payment-batches-list', data)
    },
    paymentDetailsList: (data)=>{
        // 批次明细列表
        return Ajax.get('/opt/accounting/payment-details-list', data)
    },
    accountingGenBtn: (data)=>{
        // 汇款批次 付款确认
        return Ajax.get('/opt/accounting/genBtn', data)
    },
    getAccountingAccounts: (data)=>{
        // 收款账户 列表
        return Ajax.get('/opt/accounting/accounts', data)
    },
    getAccountGen: (data)=>{
        // 收款账户 钱包
        return Ajax.get(`/opt/accounting/account/gen/${data}`)
    },
    postAccountReset: (data)=>{
        // 收款账户 重置
        return Ajax.post(`/opt/accounting/account/reset/${data}`)
    },
    setFreeze: (unionId) => {
        // 冻结
        return Ajax.post(`/opt/account/freeze/${unionId}`)
    },
    setUnfreeze: (unionId) => {
        // 解冻
        return Ajax.post(`/opt/account/unfreeze/${unionId}`)
    },
    setShield: (unionId) => {
        // 屏蔽
        return Ajax.put(`/opt/account/shield-wallet/${unionId}`)
    },
    setUnShield: (id) => {
        // 解屏蔽
        return Ajax.put(`/opt/account/unfreeze/shield-wallet/${id}`)
    }
}
