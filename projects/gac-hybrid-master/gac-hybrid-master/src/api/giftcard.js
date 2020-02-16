import request from '../libs/axios'
export function test(query) {
    return request({
      url: '/product/productSku/front/v2.2/getSkuByProductId?productId=10',
      method: 'get',
      params: query
    })
}

export function getfriendLog(query) {
  return request({
    url: '/operation/invitation/front/v3.1.1/getfriendLog',
    method: 'get',
    params: query,
    headers:{
      'Authorization':window.GAC.accessToken
    }
  })
}

export function findassistanceCount(query) {
  return request({
    url: '/operation/invitation/front/v3.1.1/findassistanceCount',
    method: 'get',
    params: query,
    headers:{
      'Authorization':window.GAC.accessToken
    }
  })
}

export function giftRemainCount(query) {
  return request({
    url: '/operation/invitation/front/v3.1.1/giftRemainCount',
    method: 'get',
    params: query,
    headers:{
      'Authorization':window.GAC.accessToken
    }
  })
}


export function  forwardMall (query) {
  return request({
      url: '/operation/invitation/front/v3.1.1/forwardMall',
      method: 'get',
      params: query,
      headers:{
        'Authorization':window.GAC.accessToken
      }
  })
}

export function  phoneIsChanged (query) {
  return request({
      url: '/operation/invitation/front/v3.1.1/phoneIsChanged',
      method: 'get',
      params: query,
      headers:{
        'Authorization':window.GAC.accessToken
      }
  })
}

export function  exchangeGiftCode (query) {
  return request({
      url: '/operation/invitation/front/v3.1.1/exchangeGiftCode',
      method: 'get',
      params: query,
      headers:{
        'Authorization':window.GAC.accessToken
      }
  })
}


export function  getQrCode (params) {
  return request({
      url: '/community/poster/front/v2.2/getPosterUrl',
      method: 'POST',
      data: {
        contentId:params.contentId,
        type:params.type,
        page:params.page,
        scene:encodeURIComponent(params.scene)
      },
      headers:{
        'Authorization':window.GAC.accessToken
      }
  })
}
