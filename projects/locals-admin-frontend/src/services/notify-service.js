import Ajax from '../utils/axios.js'
import qs from 'qs'

export default {
    setNotice: (data)=>{
        // 获取列表
        return Ajax.post('/im/notice', data)
    },
    getNotice: (data)=>{
        // 获取通知
        return Ajax.get('/im/system/notice', data)
    },
    delNotice: (data)=>{
        // 删除通知
        // console.log('qs.stringify(data)', )
        // qs会把数组转成 k[0]=1&k[1]=[2]... 正则把k后面的中括号和数组去掉, 后台接收 k=1&k=2&k=3...
        return Ajax.delete('/im/v2/notice', `?${qs.stringify(data).replace(/%5B\w+%5D/g, '')}`, true)
    }
}
