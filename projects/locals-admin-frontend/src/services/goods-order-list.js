import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/booking-plus/orderflash', data)
    }
}