import Ajax from '../utils/axios.js'

export default {
    getUserTagTable: data =>{
        return Ajax.get('/coupon/user-labels',data)
    },
    postUserLabel : data =>{
        return Ajax.post('/coupon/user-label',data)
    },
    deleteUserLabel :id =>{
        return Ajax.delete(`/coupon/user-label/${id}`)
    },
    getUserTag : id =>{
        return Ajax.get(`/coupon/user-label/${id}`)
    },
    updateUserTag: data =>{
        return Ajax.put('/coupon/user-label/',data)
    }

}