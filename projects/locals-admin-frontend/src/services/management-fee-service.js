import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        // 获取房费运营管理列表
        return Ajax.get('/opt/houseSouceOperate/list', data)
    },
    saveFeeImport: (data)=>{
        // 导入房费运营管理
        return Ajax.post('/opt/houseSouceOperate/import', data)
    },
    getHouseSourceRateList: (data)=>{
        // 获取房源管理费率列表
        return Ajax.get('/opt/houseSourceRate/list', data)
    },
    houseSourceRateImport: (data)=>{
        // 导入房源管理费率
        return Ajax.get('/opt/houseSourceRate/import', data)
    },
    getAccountingList: (data)=>{
        // 获取房源管理费率列表
        return Ajax.get('/opt/accounting/payment-details', data)
    },
    getCommonBatchList: (data)=>{
        // 批号列表
        return Ajax.get('/opt/commonBatch/list', data)
    }
}