import { api, nodeApi } from '../config/config.js'

/**
 * 使wx.request支持Promise写法
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetch (method, path, params) {
    const [ url, apiStatus = '' ] = path.split(/\s/)
    const isUseNodeApi = apiStatus.toUpperCase() === 'NODE'

    let token = wx.getStorageSync('token')
    // 过滤请求参数为空
    const header = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
    }
    if(token) {
        header['LOCALS-ACCESS-TOKEN'] = 'Bearer ' + token
    }
    let filterParams = {}
    for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] || params[key] === 0) {
            filterParams[key] = params[key]
        }
    }
    let apiurl = ''
    if (path.indexOf('http') !== -1) {
        apiurl = `${path}`
    } else {
        apiurl = !isUseNodeApi ? `${api}/${url}` : `${nodeApi}/${url}`
    }
    return new Promise((resolve, reject) => {
            const app = getApp() || {}
            app.requestTask = wx.request({
            method,
            url: apiurl,
            data: Object.assign({}, filterParams),
            header: header,
            success: res => {
                const { data, statusCode } = res;
                if (statusCode === 200 && data.success) {
                    resolve(data)
                } else {
                    const { header } = res;
                    const { errorCode } = data;
                    // 20113: token无效, 20118: token已过期, 20119: 帐号在别处登录， 20120: 超过天未登录
                    const cleanLoginStatusArray = ['20113', '20118', '20119', '20120'];
                    if (errorCode && cleanLoginStatusArray.includes(errorCode)) {
                        wx.clearStorageSync()
                    }

                    if (header) {
                        const headerDummy = {}; 
                        Object
                            .keys(header)
                            .forEach(item => {
                                headerDummy[item.toLocaleLowerCase()] = header[item];
                            })
                        let traceid = headerDummy['x-b3-traceid'] || ''
                        if (traceid) {
                            res.data.traceId = traceid.slice(0, 6)
                        }
                    }
                    reject(res.data)
                }
            },
            fail: res => {
                reject(res.errMsg)
            }
        })
    })
}

/**
 * 此ajax方法可以在res.success=false的时候，在成功回调处理错误信息
 * 使wx.request支持Promise写法
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function ajax (method, path, params) {
    const [ url, apiStatus = '' ] = path.split(/\s/)
    const isUseNodeApi = apiStatus.toUpperCase() === 'NODE'

    let token = wx.getStorageSync('token')
    // 过滤请求参数为空
    const header = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
    }
    if(token) {
        header['LOCALS-ACCESS-TOKEN'] = 'Bearer ' + token
    }
    let filterParams = {}
    for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] || params[key] === 0) {
            filterParams[key] = params[key]
        }
    }
    let apiurl = ''
    if (path.indexOf('http') !== -1) {
        apiurl = `${path}`
    } else {
        apiurl = !isUseNodeApi ? `${api}/${url}` : `${nodeApi}/${url}`
    }
    return new Promise((resolve, reject) => {
        const app = getApp() || {}
        app.requestTask = wx.request({
            method,
            url: apiurl,
            data: Object.assign({}, filterParams),
            header: header,
            success: res => {
                const { data, statusCode } = res;
                if (statusCode === 200 || statusCode === 304) {
                    resolve(data)
                } else {
                    const { header } = res;
                    const { errorCode } = data;
                    // 20113: token无效, 20118: token已过期, 20119: 帐号在别处登录， 20120: 超过天未登录
                    const cleanLoginStatusArray = ['20113', '20118', '20119', '20120'];
                    if (errorCode && cleanLoginStatusArray.includes(errorCode)) {
                        wx.clearStorageSync()
                    }

                    if (header) {
                        const headerDummy = {};
                        Object
                            .keys(header)
                            .forEach(item => {
                                headerDummy[item.toLocaleLowerCase()] = header[item];
                            })
                        let traceid = headerDummy['x-b3-traceid'] || ''
                        if (traceid) {
                            res.data.traceId = traceid.slice(0, 6)
                        }
                    }
                    reject(res.data)
                }
            },
            fail: res => {
                reject(res.errMsg)
            }
        })
    })
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const app = getApp() || {}
        const header = {
            'Accept': 'application/json, text/plain, */*'
        }
        app.requestTask = wx.request({
            url,
            header,
            method: 'GET',
            success: res => {
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else {
                    reject(res.data)
                }
            },
            fail: res => {
                reject(res.errMsg)
            }
        })
})
}

module.exports = {
    get: function (url, params) {
        return fetch('GET', url, params)
    },
    post: function (url, params) {
        return fetch('POST', url, params)
    },
    delete: function (url, params) {
        return fetch('DELETE', url, params)
    },
    put: function (url, params) {
        return fetch('PUT', url, params)
    },
    ajaxGet: function (url, params) {
        return ajax('GET', url, params)
    },
    ajaxPost: function (url, params) {
        return ajax('POST', url, params)
    },
    ajaxDelete: function (url, params) {
        return ajax('DELETE', url, params)
    },
    fetchJSON: function (url) {
        return fetchJSON(url)
    }
}
