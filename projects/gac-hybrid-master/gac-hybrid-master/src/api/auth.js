// 权限相关
import request from '../libs/axios'
export function getConfig(query) {
    return request({
      url: '/commserv/third-part-account/front/v3.1.1/jsSdkSignature',
      method: 'get',
      params: query
    })
  }

  

  export function getToken(query) {
    return request({
      url: '/auth/openid/token?grant_type=mobile&scope=server&userSource=5&wxCode='+query.wxCode,
      method: 'post',
      headers: {
        'Authorization': 'Basic d2VpeGluLWNsaWVudDp3ZWl4aW5zZWNyZXQxMjM='
      },
    })
  }