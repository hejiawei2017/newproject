import Ajax from '../utils/axios.js'

export default {
    getTable: (data) => {
        return Ajax.get(`/opt/accounting/payment-notifies-list`)
    }
}