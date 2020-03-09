import Ajax from '../utils/axios.js'

export default {
    getTable: (data) => {
        return Ajax.get('/prod-plus/house/report', data)
    },
    getRoomStatusTable: (data) => {
        return Ajax.get('/prod-plus/backstage/calendar/trends', data)
    },
    getTrendsOrders: (data) => {
        return Ajax.get(`/prod-plus/backstage/calendar/trends/orders`,data)
    },
    fetchHandedOrder: (data) => {
        return Ajax.post(`/prod-plus/backstage/handed-order`, data)
    },
    fetchBackstageCalendarPrice: (data) => {
        return Ajax.put(`/prod-plus/backstage/calendar/price`, data)
    },
    calendarTrandsOrderType: (data) => {
        return Ajax.put(`/prod-plus/calendar/trends/order-type?orderNo=${data.orderNo}&orderType=${data.orderType}`,data)
    },
    selfOccupation: (data) => {
        return Ajax.put(`/prod-plus/backstage/self-occupation?bookingId=${data.bookingId}`,data)
    },
    getDistricts: (data) => {
        return Ajax.get('/base/china-areas', data)
    },
    fetchHouseCustomerTag: (data) => {
        return Ajax.get(`/prod-plus/category/type/${data}/customer/tag`)
    },
    setHouseCustom: (data) => {
        return Ajax.post(`/prod-plus/houses/custom/tag/map`, data)
    },
    fetchHouseImages: (url,data) => {
        return Ajax.get(url,data)
    },
    cancelBookingsOrder: (data) => {
        return Ajax.put(`/booking-plus/admin/bookings/hand_order/cancel`,data)
    },
    sendOrderPassword: (data) => {
        return Ajax.put(`/booking-plus/assist/order/send_password`,data)
    },
    calenderBlocking: (data) => {
        return Ajax.put(`/prod-plus/backstage/calendar/blocking`,data)
    },
    cancelCalenderBlocking: (data) => {
        return Ajax.delete(`/prod-plus/backstage/calendar/release-blocking`,data)
    },
    setHouseStatus: (data) =>{
        return Ajax.post('/prod-plus/houses/source/status',data) // 修改房源管理状态
    },
    delHouseCustomerTag: (data) =>{
        return Ajax.delete('/prod-plus/houses/custom/tag/map/batch_delete',data) // 修改房源管理状态
    },
    getCityList: data => {
        return Ajax.get('/base/china-areas', data)
    }
}
