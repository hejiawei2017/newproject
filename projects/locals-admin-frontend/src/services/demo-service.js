import Ajax from '../utils/axios.js'
export default {
    getTable: (data)=>{
        return Ajax.get('/base/china-areas', data)
    }
}