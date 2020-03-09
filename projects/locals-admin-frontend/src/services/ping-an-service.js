import Ajax from '../utils/axios.js'
import { createUUID } from "../utils/utils"
export default {
    upload: (data, id = createUUID('xxxxxxxxxxxxxxxx', 10), fileName = data.type.replace('/', '.')) => {
        const formData = new FormData()
        formData.append('file', data, fileName)
        return Ajax.uploadPost(`/booking-plus/checkin/booking-pa-house/import-and-writeOff`, formData)
    },
    insure: (data) => {//done
        return Ajax.get(`/booking-plus/checkin/pa/standard-apply-policy`, data)
    }
}