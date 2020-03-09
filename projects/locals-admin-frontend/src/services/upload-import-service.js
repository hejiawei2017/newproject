import Ajax from '../utils/axios.js'
import {createUUID} from "../utils/utils"
export default {
    upload: (data,id = createUUID('xxxxxxxxxxxxxxxx',10),fileName = data.type.replace('/','.')) => {
        // 上传文件
        const formData = new FormData()
        formData.append('file', data, fileName)
        console.log('formData', formData, data, fileName)
        return Ajax.uploadPost(`/atta/attachment-byte/model/${id}/name/platform`, formData)
    },
    uploadFile: (file,id = createUUID('xxxxxxxxxxxxxxxx',10)) => {
        // 上传文件
        return Ajax.uploadPost(`/atta/attachment-byte/model/${id}/name/platform`, file)
    },
    action: () => {
        return '//jsonplaceholder.typicode.com/posts/'
    }
}