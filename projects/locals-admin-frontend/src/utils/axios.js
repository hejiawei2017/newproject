import axios from 'axios'
import {envConfig, getCookie, clearAllCookie, reg as regExp} from './utils'
import {notification, message } from 'antd'

const noApiToken = [
    '/platform/auth/auth-code/send',
    '/platform/auth/auth-code/sign-in',
    '/platform/auth',
    'restapi.amap.com'
]
const noApiHeader = [
    'restapi.amap.com'
]
const setHeader = (url, method)=> {
    if(method === "UPLOAD"){
        return {
            'Accept': '*/*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With'
        }
    }
    let header = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8'
    }
    let token = getCookie('token')
    // 如果存在token直接加入到头部
    if(token && (!noApiToken.includes(url))){
        header["Access-Control-Allow-Headers"] = 'accept, content-type, LOCALS-ACCESS-TOKEN'
        header["LOCALS-ACCESS-TOKEN"] = `Bearer ${token}`
    }else{
        header["Access-Control-Allow-Headers"] = 'accept, content-type'
    }
    if(url.includes('http') && noApiHeader.includes(url.split('/')[2])){
        return {}
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
/**
 * 判断额外接口 返回参数
 * @param {object} data // 接口数据
 */
const isResolve = function (data) {
    if(data){
        let array = [{
            checkKey: 'info',
            returnKey: 'regeocode'
        }]
        for (let i = 0; i < array.length; i++) {
            let before = array[i]
            let isDataKey = data[before['checkKey']]
            if (isDataKey === 'ok' || isDataKey === 'OK' || isDataKey === true) {
                return data[before['returnKey']]
            }
        }
        return false
    }else{
        return false
    }
}
/**
 * ajax function
 * @param {string} method // 接口类型
 * @param {string} url 接口地址 如果http 则不添加前缀
 * @param {object} params // 参数
 */
const Ajax = (method, url, params) => {
    var myRequest = ''
    // 开发环境联调后端
    if(url.indexOf('http') >= 0){
        myRequest = url
    }else if(url.indexOf('https') >= 0){
        myRequest = url
    }else{
        myRequest = envConfig.api + url
    }
    if(method === 'getMiddlewareApi'){
        method = 'get'
        myRequest = envConfig.middlewareApi + url
    }
    method = method.toUpperCase()
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

    let getTraceId = "";
    return new Promise((resolve, reject) =>
        axios({
            url: myRequest,
            method,
            headers: header,
            // credentials : 'omit',
            // mode : "cors",
            data: params
        }).then((response) => {
            getTraceId = response.headers && response.headers['x-b3-traceid'] ? response.headers['x-b3-traceid'] : '';
            if (response.ok || response.status === 200) {
                return response.data;
            } else {
                try {
                    fundebug.notify("ajaxError",response.status,{...params,myRequest})// eslint-disable-line no-undef
                } catch (error) {}
                reject({status:response.status})
            }
        }).then(responseData => {
            if(responseData && responseData.success){
                resolve(responseData.data)
            }else if(responseData && responseData.errorCode){
                try {
                    const errorMsg = responseData.errorMsg
                    const code = responseData.errorCode
                    const errorDetail = responseData.errorDetail
                    const description = responseData.errorCode + " => " + (errorDetail || '') + " => " + (errorMsg || '')
                    const text = regExp.chinese.test(errorMsg) ? errorMsg : (regExp.chinese.test(errorDetail) ? errorDetail : '')
                    console.log(regExp.chinese,regExp.chinese.test(errorMsg),errorMsg, typeof errorMsg)
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
                            const addTraceidText = getTraceId ? `${text} 您的Traceid: ${getTraceId}` : text //添加traceId
                            notification.warning({
                                message: '请求出错，请稍后再试！',
                                description: addTraceidText
                            })
                        }
                    }

                    reject({
                        status:responseData.errorCode,
                        errorDetail:responseData.errorDetail,
                        errorMsg:responseData.errorMsg,
                        data:responseData.data,
                        description})
                } catch (error) {
                    console.log('ajaxError')
                    // message.warning('请求出错')
                    message.warning(`请求出错  ${getTraceId ? `您的Traceid:${getTraceId}` : ''}`)
                }
            }else if(url.includes('http://') || url.includes('https://')){
                let data = isResolve(responseData)
                if(data){
                    resolve(data)
                }else{
                    // message.warning('请求出错')
                    message.warning(`请求出错  ${getTraceId ? `您的Traceid:${getTraceId}` : ''}`)
                }
            }else{
                try {
                    const errorMsg = responseData.errorMsg
                    const errorDetail = responseData.errorDetail
                    const description = responseData.errorCode + " => " + (errorDetail || '') + " => " + (errorMsg || '')
                    const text = regExp.chinese.test(errorMsg) ? errorMsg : (regExp.chinese.test(errorDetail) ? errorDetail : '')
                    console.log(regExp.chinese,regExp.chinese.test(errorMsg),errorMsg, typeof errorMsg)
                    try {
                        fundebug.notify("ajaxError",responseData.errorDetail,{...params,myRequest})// eslint-disable-line no-undef
                    } catch (error) {}
                    const addTraceidText = getTraceId ? `${text} 您的Traceid: ${getTraceId}` : text //添加traceId
                    console.log(addTraceidText,"addTraceidText")
                    notification.warning({
                        message: '请求出错，请稍后再试！',
                        description: addTraceidText
                    })

                    reject({
                        status:responseData.errorCode,
                        errorDetail:responseData.errorDetail,
                        errorMsg:responseData.errorMsg,
                        data:responseData.data,
                        description})
                } catch (error) {
                    console.log('ajaxError')
                    message.warning(`请求出错  ${getTraceId ? `您的Traceid:${getTraceId}` : ''}`)
                }
            }
            // console.log('[GET]ajaxResponse:',responseData)
        })
    )
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
    async formGet ( url, filename,params = {},withParams = false ) {
        if(withParams){
            let enCodeData = urlEncode(params).substr(1);
            if(enCodeData){
                if(url.includes('?')){
                    url += '&' + enCodeData
                }else{
                    url += '?' + enCodeData
                }
            }
        }
        return Ajax('form', url, filename)
    },
    getMiddlewareApi ( url, data) {
        let enCodeData = urlEncode(data).substr(1)
        if(enCodeData){
            if(url.includes('?')){
                url += '&' + enCodeData
            }else{
                url += '?' + enCodeData
            }
        }
        return Ajax('getMiddlewareApi', url, data)
    }
}
