import Ajax from '../utils/axios.js'

export default {
    getTable: (data) => {
        return Ajax.get('/booking-plus/invoice/list/page', data)
    },
    getDetail: (data) => {
        return Ajax.get(`/booking-plus/invoice/${data}`)
    },
    updateInvoice: (data) => {
        return Ajax.put(`/booking-plus/invoice/`, data)
    },
    addExpress: (data) => {
        return Ajax.put(`/booking-plus/invoice/express`, data)
    },
    addInvoiceURL: (data) => {
        return Ajax.put(`/booking-plus/invoice/url`, data)
    },
    sendEmail: (id) => {
        return Ajax.get(`/booking-plus/invoice/email/${id}`)
    }
}