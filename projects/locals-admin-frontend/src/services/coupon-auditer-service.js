import Ajax from '../utils/axios.js'

export default {
    getAuditList: data =>{
        return Ajax.get('/coupon/reviewers',data)
    },
    putAudit: data =>{
        return Ajax.put('/coupon/reviewer',data)
    },
    deleteAudit: id =>{
        return Ajax.delete(`/coupon/reviewer/${id}`)
    },
    addAudit:data=>{
        return Ajax.post('/coupon/reviewer',data)
    }
}