import Ajax from '../utils/axios.js'

export default {
    getActivitiesList : data =>{
        return Ajax.get('/coupon/activities',data)
    },
    postActivitie : data => {
        return Ajax.post('/coupon/activity',data)
    },
    deleteActivitie : id => {
        return Ajax.delete(`/coupon/activity/${id}`)
    },
    putActivitie : data =>{
        return Ajax.put(`/coupon/activity/`,data)
    },
    postActivitieItem : data => {
        return Ajax.post('/coupon/activity-item',data)
    },
    getActivitie : id =>{
        return Ajax.get(`/coupon/activity/${id}`)
    },
    deleteActivitieItem : id =>{
        return Ajax.delete(`/coupon/activity-item/${id}`)
    },
    putActivitieItem : data =>{
        return Ajax.put('/coupon/activity-item',data)
    }
}