import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        // 获取列表
        return Ajax.get('/opt/accounting/account-wallets', data)
    },
    getWalletInfo: (data)=>{
        // 获取详情
        return Ajax.get('/opt/accounting/payment-details-sum', data)
    },
    getWalletSynInfo: (data)=>{
        // 同步数据
        return Ajax.get('/opt/accounting-summary/syn', data)
    }
}