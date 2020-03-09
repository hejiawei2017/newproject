import Ajax from '../utils/axios.js'

export default {
    getLongRentalApproval: (data) =>{
        return Ajax.get('/prod-plus/long/rental/house/source/approval',data) // 获取上架审批和变更审批列表
    },
    getLongRentalApprovalDetail: (data) =>{
        return Ajax.get('/prod-plus/long/rental/house/source/approval/details', data) // 获取长租上架审批详情
    },
    getLongRentalUnitDetail: (data) =>{
        return Ajax.get('/prod-plus/long/rental/house/source/unit/details', data) // 获取长租出租单元详情
    },
    getLongRentalImages: (data) =>{
        return Ajax.get('/prod-plus/house/source/long/rental/images', data) // 获取长租房源图片
    },
    getTextImages: () =>{
        return Ajax.get('/prod-plus/house/931070309505437699/images') // 获取长租房源图片
    },
    getLongRentalLog: (data) =>{
        return Ajax.get('/prod-plus/long/rental/house/source/approval/log', data) // 获取长租房源审批结果
    },
    getLongRentalList: (data) =>{
        return Ajax.get('/prod-plus/long/rental/house/source/list', data) // 获取或查询长租房源列表
    },
    getLongRentalHouseDetail: (data) =>{
        return Ajax.get('/prod-plus/long/rental/house/source/details', data) // 获取长租房源详情
    }
}
