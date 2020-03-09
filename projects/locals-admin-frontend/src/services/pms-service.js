import Ajax from '../utils/fetch.js'

export default {
    getStoreTable: (data) =>{ // 获取table列表
        return Ajax.get('/prod-plus/pms/hotels',data)
    },
    getStoreInfo: (data) =>{ // 获取某个门店的信息
        return Ajax.get(`/prod-plus/pms/hotel/${data}/info`)
    },
    getStoreImage: (data) =>{ // 获取某个门店的图片
        return Ajax.get(`/prod-plus/pms/hotel/${data}/image`)
    },
    getYetStoreUnderHouse: (hotelId) =>{ //获取某个门店已经存在的房源列表
        return Ajax.get(`/prod-plus/pms/hotel/${hotelId}/houses`)
    },
    getCanStoreUnderHouse: (hotelId,hotelType) =>{ //获取某个门店可下挂的房源列表
        return Ajax.get(`/prod-plus/pms/hotel/house?hotelNo=${hotelId}&hotelType=${hotelType}`)
    },
    saveStoreUnderHouse: (hotelId,data) =>{ // 保存门店的下挂房源
        return Ajax.post(`/prod-plus/pms/hotel/${hotelId}/house-mount`,data)
    },
    delStoreUnderHouse: (hotelId,data) =>{ // 删除门店的下挂房源
        return Ajax.delete(`/prod-plus/pms/hotel/${hotelId}/houses`,data)
    },
    addStore: (data) =>{ //  新增门店
        return Ajax.post('/prod-plus/pms/hotel/info',data)
    },
    correctingHouseNo: (houseNo,data) =>{ //  验证合同是否存在
        return Ajax.get(`/old/contract-houseNo/${houseNo}`,data)
    },
    editStore: (hotelId,data) =>{
        return Ajax.put(`/prod-plus/pms/hotel/${hotelId}/info`,data) //  编辑门店
    },
    correctingEmployee: (data) =>{
        return Ajax.get(`/platform/employee/mobile?mobile=${data}`) // 验证员工是否存在
    },
    getFacilityDict: () =>{
        return Ajax.get('/prod-plus/house-dictionary/facility') // 获取设施字典
    },
    getStoreFacility: (data) =>{
        return Ajax.get(`/prod-plus/pms/hotel/${data}/facility`) // 获取门店设施
    },
    saveStoreFacility: (hotelId,data) =>{
        return Ajax.put(`/prod-plus/pms/hotel/${hotelId}/facility`,data) // 保存门店设施
    },

    // commentDel: (data) =>{
    //     return Ajax.delete(`/prod-plus/comment/${data}`,true) // 删除评论
    // },
    // commentOnly: (data) =>{
    //     return Ajax.get(`/prod-plus/comment/${data}`,true) // 获取单条评论信息
    // },
    // updateComment: (data) =>{
    //     return Ajax.put('/prod-plus/comment',data,true) // 更新评论
    // },
    // addComment: (data) =>{
    //     return Ajax.post('/prod-plus/comment',data) // 增加评论
    // },
    getStoreStateTable: (data) => {
        return Ajax.get('/prod-plus/backstage/calendar/pms-trends', data)
    },
    putPmsStock: (data) => {
        return Ajax.put('/prod-plus//backstage/calendar/stock-for-pms', data)
    },
    putPmsPrice: (data) => {
        return Ajax.put('/prod-plus/pms/hotel/price', data)
    },
    getRoomList: (data) => {
        return Ajax.get(`/prod-plus/pms/${data}/room-number`) // 获取房号列表
    },
    getRoomType: (hotelId) => {
        return Ajax.get(`/prod-plus/pms/hotel/${hotelId}/houses`) // 获取房源列表
    },
    addRoomList: (data) => {
        return Ajax.post(`/prod-plus/pms/room-number`,data) // 增加房号
    },
    editRoomList: (data) => {
        return Ajax.put(`/prod-plus/pms/room-number`,data) // 编辑房号
    },
    checkDoorLock: (data) => {
        return Ajax.post(`/prod-plus/house/v2/set-door-lock`,data) // 检查门锁ip
    },
    deleteRoomList: (data) => {
        return Ajax.delete(`/prod-plus/pms/room-number`,data) // 删除房号
    },
    getPmsEmployee: (data) => {
        return Ajax.get(`/prod-plus/pms/hotel-role/employee`,data) // 获取门店员工信息
    },
    addPmsEmployee: (data) => {
        return Ajax.post(`/prod-plus/pms/hotel-role/employee`,data) // 新增门店员工信息
    },
    deletePmsEmployee: (data) => {
        return Ajax.delete(`/prod-plus/pms/hotel-role/employee`,data) // 删除门店员工信息
    }
}
