import Ajax from '../utils/axios.js'

let importUrl = '/opt-plus/map/address/import'

export default {
    download: ()=>{
        return 'http://f.localhome.cn/map/activate.xlsx'
    },
    uploadUrl: ()=>{
        return importUrl
    },
    upload: (data)=>{
        return Ajax.post(importUrl,data)
    }
}