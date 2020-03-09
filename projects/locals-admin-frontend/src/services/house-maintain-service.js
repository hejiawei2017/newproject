import Ajax from '../utils/axios.js'

export default {
    //获取房源地址信息
    fetchHouseAddress: (data)=>{
        return Ajax.get(`/prod-plus/aai/house/${data}/address`)
    },
    //获取省市区
    fetchCascaderAddressData: (data) => {
        return Ajax.get(`/base/china-areas`, data)
    },
    updateAddress: (houseId, data) => {
        return Ajax.put(`/prod-plus/aai/house/${houseId}/address`, data)
    },
    //获取房屋类型
    fetchHouseKind: () => {
        return Ajax.get('/prod-plus/house-dictionary/house-kind')
    },
    //获取房屋信息
    fetchHouseRoom: (houseId) => {
        return Ajax.get(`/prod-plus/aai/house/${houseId}/room`)
    },
    //更新房屋信息
    updateHouseRoom: (houseId, data) => {
        return Ajax.put(`/prod-plus/aai/house/${houseId}/room`, data)
    },
    //获取房屋价格
    fetchHousePriceInfo: (houseId) => {
        return Ajax.get(`/prod-plus/aai/house/${houseId}/price-act`)
    },
    //更新房屋价格
    updateHousePriceInfo: (houseId, data) => {
        return Ajax.put(`/prod-plus/aai/house/${houseId}/price-act`, data)
    },
    //获取房屋描述
    fetchHouseDescribe: (houseId) => {
        return Ajax.get(`/prod-plus/aai/house/${houseId}/desc`)
    },
    //更新房屋描述
    updateHouseDescribe: (houseId, data) => {
        return Ajax.put(`/prod-plus/aai/house/${houseId}/desc`, data)
    },
    //获取横图
    fetchHouseHorizontalImages: (houseId) => {
        return Ajax.get(`/prod-plus/aai/house/${houseId}/horizontal-images`)
    },
    //获取路客主图
    fetchHouseMainImages: (houseId) => {
        return Ajax.get(`/prod-plus/aai/house/${houseId}/images`)
    },
    //新增路客主图
    addHouseMainImages: (houseId, data) => {
        return Ajax.post(`/prod-plus/aai/house/${houseId}/images`, data)
    },
    //删除房屋图片
    deleteHouseMainImages: (houseId, imageId) => {
        return Ajax.delete(`/prod-plus/aai/house/${houseId}/image/${imageId}`)
    },
    //房屋主图描述
    editHouseMainImages: (houseId, imageId, data) => {
        return Ajax.put(`/prod-plus/aai/house/${houseId}/image/${imageId}`, data)
    },
    //新增路客横图
    addHouseBalanceImages: (houseId, data) => {
        return Ajax.post(`/prod-plus/aai/house/${houseId}/horizontal-images`, data)
    },
    //删除房屋横图
    deleteHouseBalanceImages: (houseId, imageId) => {
        return Ajax.delete(`/prod-plus/aai/house/${houseId}/horizontal-image/${imageId}`)
    },
    //房屋横图描述
    editHouseBalanceImages: (houseId, imageId, data) => {
        return Ajax.put(`/prod-plus/aai/house/${houseId}/horizontal-image/${imageId}`, data)
    }
}
