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
    },
    getPayType: (data)=>{
        //钱包款项类型列表
        return Ajax.get('/opt/accounting/payment-type-list' ,data)
    },
    getWalletDetail: (data,aData)=>{
        //钱包明细
        if(aData.isHedging === undefined){
            // 2018-12-27 根据文杰要求修改
            aData.isHedging = 1;
        }
        return Ajax.get('/opt/accounting/payment-details-wallet?' + data, aData)
    },
    getFreezeDetail: (data,aData)=>{
        //冻结明细
        if(aData.isHedging === undefined){
            // 2018-12-27 根据文杰要求修改
            aData.isHedging = 1;
        }
        return Ajax.get('/opt/accounting/payment-details-wallet?' + data, aData)
    },
    getArrearsDetail: (data, aData)=>{
        //欠款明细
        if(aData.isHedging === undefined){
            // 2018-12-27 根据文杰要求修改
            aData.isHedging = 0;

        }
        data = data.replace(/oweSumLessThan=[^&]+/g,'').replace(/payTypeIn=[^&]+/g,'').replace(/&+/g,'&');
        return Ajax.get('/opt/accounting/payment-details-owe?' + data, aData)
    },
    getOrderNo: (id) => {
        return Ajax.get(`/booking-plus/system/order/${id}`)
    }
}