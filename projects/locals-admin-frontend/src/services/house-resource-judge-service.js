import Ajax from '../utils/axios.js'

let judgeUrl = '/opt-plus/map/address/judge'

export default {
    download: ()=>{
        return 'http://f.localhome.cn/map/filter.xlsx'
    },
    uploadUrl: ()=>{
        return judgeUrl
    },
    upload: (data)=>{
        return Ajax.post(judgeUrl,data)
    }
}