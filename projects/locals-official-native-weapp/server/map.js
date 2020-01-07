const api = 'https://restapi.amap.com/v3'
const key = 'b403e838708e55f7f871baa0a5ea3ffe'

function batchRequest(data) {
    return new Promise((resolve, reject) => {
        wx.request({
            method: 'POST',
            url: `${api}/batch?key=${key}`,
            data,
            success: res => {
                resolve(res)
            },
            fail: res => {
                reject(res)
            } 
        })
    })
}

function getDistrict(data) {
    data.key = key
    return new Promise((resolve, reject) => {
        wx.request({
            method: 'GET',
            url: `${api}/config/district`,
            data: data,
            success: res => {
                resolve(res)
            },
            fail: res => {
                reject(res)
            }
        })
    })
}
/**
 * 坐标转换
 * @param {String} data
 */
function convertLocation (data) {
    return new Promise((resolve, reject) => {
        wx.request({
        method: 'GET',
        url: `${api}/assistant/coordinate/convert`,
        data: {
            key: key,
            locations: data
        },
        success: res => {
            resolve(res)
        },
        fail: res => {
            reject(res)
        }
    })
})
}
/**
 * 地理编码
 */
function getGeoCode (data) {
    return new Promise((resolve, reject) => {
            wx.request({
            method: 'GET',
            url: `${api}/geocode/geo`,
            data: {
                key: key,
                address: data.address,
                city: data.city
            },
            success: res => {
                resolve(res)
            },
            fail: res => {
                reject(res)
            }
        })
    })
}

/**
 * 逆地理编码
 * @param {String} data 
 */
function getLocationInfo (data) {
    return new Promise((resolve, reject) => {
            wx.request({
            method: 'GET',
            url: `${api}/geocode/regeo`,
            data: {
                key: key,
                location: data
            },
            success: res => {
                resolve(res)
            },
            fail: res => {
                reject(res)
            }
        })
    })
}

/**
 * 获取静态地图
 * @param {Object} data 
 */
function getStaticMap (data) {
    let params = {
        location: data.location,
        zoom: data.zoom,
        size: data.size,
        scale: data.scale,
        markers: data.markers
    }
    let url =  `${api}/staticmap?key=${key}`
    for (let k in params) {
        if (params.hasOwnProperty(k) && params[k]) {
            url += `&${k}=${params[k]}`
        }
    }
    return url
}

module.exports = {
    getLocationInfo,
    convertLocation,
    getStaticMap,
    getDistrict,
    getGeoCode,
    batchRequest
}