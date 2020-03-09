import { notification, message } from 'antd'
import {envConfig,getCookie, clearAllCookie, reg} from './utils'

const noApiToken = [
    '/platform/auth/auth-code/send',
    '/platform/auth/auth-code/sign-in',
    '/platform/auth'
]
const setHeader = (url,method)=> {
    if(method === "UPLOAD"){
        return new Headers({
            'Accept': '*/*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
            'Accept-Encoding': 'gzip, deflate, br'
        })
    }
    let header = new Headers({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept-Encoding': 'gzip, deflate, br'
    })
    let token = getCookie('token')
    // 如果存在token直接加入到头部
    if(token && (!noApiToken.includes(url))){
        header.append("Access-Control-Allow-Headers", 'accept, origin, content-type, LOCALS-ACCESS-TOKEN')
        header.append("LOCALS-ACCESS-TOKEN",`Bearer ${token}`)
    }
    return header
}
const urlEncode = function (param, key, encode) {

    //拼接参数
    if (param == null) return ''
    var paramStr = ''
    var t = typeof (param)
    if (t === 'string' || t === 'number' || t === 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
    } else {
        if (param instanceof Array) {
            paramStr += urlEncode(param.join(','), key)
        } else {
            for (var i in param) {
                var k = key == null ? i : key + ('.' + i)
                paramStr += urlEncode(param[i], k, encode)
            }
        }

    }

    return paramStr
}
// let ajaxTotal = 0
let ajaxMessage
let getTraceId = "";
const Ajax = (method, url, params) => {
    method = method.toUpperCase()
    var myRequest = ''

    // if(ajaxTotal === 0 && (!ajaxMessage)){
    if(!ajaxMessage){
        ajaxMessage = message.loading('正在加载中...', 0);
        // ajaxTotal++;
    }
    // 开发环境联调后端
    if(url.indexOf('http') >= 0){
        myRequest = url
    }else if(url.indexOf('https') >= 0){
        myRequest = url
    }else{
        myRequest = envConfig.api + url
    }
    const header = setHeader(url,method)
    if(method === 'UPLOAD'){
        method = 'POST'
    }

    if(method === 'FORM'){// 异步请求下载文件
        return fetch(myRequest, {
            headers: header
        }).then(res => res.blob().then(blob => {
            let filename = res.headers.get('Content-Disposition') || params
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename)
            }else {
                let a = document.createElement('a')
                let url = window.URL.createObjectURL(blob)// 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
                a.href = url
                a.download = filename
                a.click()
                window.URL.revokeObjectURL(url)
            }
        }))
    }

    return new Promise((resolve, reject) => {
        fetch(myRequest, {
            method,
            headers: header,
            credentials : 'omit',
            mode : "cors",
            body: params
        }).then((response) => {
            getTraceId = response.headers.get('x-b3-traceid')
            setTimeout(()=>{
                // if(ajaxTotal > 0 && ajaxMessage){
                if(ajaxMessage){
                    ajaxMessage()
                    // ajaxTotal = 0;
                }
            },100)
            if (response.ok) {
                return response.json();
            } else {
                try {
                    fundebug.notify("ajaxError",response.status,{...params,myRequest})// eslint-disable-line no-undef
                } catch (error) {}
                reject({status:response.status})
            }
        }).then(responseData => {
            if(responseData && responseData.success){
                resolve(responseData.data)
            }else if(responseData){
                const errorMsg = responseData.errorMsg
                const code = responseData.errorCode
                const errorDetail = responseData.errorDetail
                const description = responseData.errorCode + " => " + (errorDetail || '') + " => " + (errorMsg || '')
                const text = reg.chinese.test(errorMsg) ? errorMsg : (reg.chinese.test(errorDetail) ? errorDetail : '')
                // console.log(reg.chinese,reg.chinese.test(errorMsg),errorMsg, typeof errorMsg)
                try {
                    fundebug.notify("ajaxError",responseData.errorDetail,{...params,myRequest})// eslint-disable-line no-undef
                } catch (error) {}
                if (url === '/platform/user/user-info') {
                    clearAllCookie()
                    const addTraceidText = getTraceId ? `${text} 您的Traceid: ${getTraceId}` : text //添加traceId
                    notification.warning({
                        message: '用户信息出错！',
                        description: addTraceidText
                    })
                }else{
                    let str = ''
                    switch (code) {
                    case '20116' :
                        str = '您还没登录，请先登录后再使用系统'
                    break
                    case '20113' :
                        str = 'Token无效，请检查账号是否有权限使用系统'
                        break
                    case '20118' :
                        str = 'Token已过期，请重新登录后再使用系统'
                        break
                    case '20119' :
                        str = '账号已经在别处登录，请检查账号是否被盗，立即更换密码'
                        break
                    case '20120' :
                        str = '账号登录过期，请重新登录'
                        break
                    case 'E10014' :
                        str = '您暂时无访问权限，若需要使用，请联系管理员开通'
                        break
                    default:
                        str = ''
                       break

                    }
                    if(str !== ''){
                        const addTraceidStr = getTraceId ? `${str} 您的Traceid: ${getTraceId}` : str //添加traceId
                        notification.warning({
                            message: '登录错误！',
                            description: addTraceidStr
                        })
                        setTimeout(() => {
                            window.location.href = '/#/login'
                        },1000)
                    }else {
                        const addTraceidText = getTraceId ? `${text}您的Traceid: ${getTraceId}` : text //添加traceId
                        console.log(addTraceidText,"addTraceidText")
                        notification.warning({
                            message: '请求出错，请稍后再试！',
                            description: addTraceidText
                        })
                    }
                }
                console.error(description)
                reject({
                    status:responseData.errorCode,
                    errorDetail:responseData.errorDetail,
                    errorMsg:responseData.errorMsg,
                    data:responseData.data,
                    description})
            }
            // console.log('[GET]ajaxResponse:',responseData)
        })
    })
    //坑爹代码，catch肯定要返回到this的位置啊，你在这里catch我还怎么讨老婆。
    //     .catch((e) => {
    //     console.log('timeout。。。。')
    //     setTimeout(()=>{
    //         if(ajaxMessage){
    //             ajaxMessage()
    //         }
    //     },100)
    // })
}

export default {
    async get ( url, data, IsUrlParams ) {
        // 传入第三个参数 true，url 拼接data
        if(IsUrlParams){
            url += '/' + data
        }else{
            let enCodeData = urlEncode(data).substr(1)
            if(enCodeData){
                if(url.includes('?')){
                    url += '&' + enCodeData
                }else{
                    url += '?' + enCodeData
                }
            }
        }
        return Ajax('get', url)
    },
    async post ( url, data ) {
        data = JSON.stringify(data)
        return Ajax('post', url, data)
    },
    async put ( url, data ) {
        data = JSON.stringify(data)
        return Ajax('put', url, data)
    },
    async delete ( url, data, IsUrlParams ) {
        // 传入第三个参数 true，url 拼接data
        if(IsUrlParams){
            url += '/' + data
            return Ajax('delete', url)
        }
        return Ajax('delete', url, data)
    },
    async uploadPost ( url, formData ) {
        return Ajax('upload', url, formData)
    },
    async formGet ( url, filename ) {
        return Ajax('form', url, filename)
    }
}