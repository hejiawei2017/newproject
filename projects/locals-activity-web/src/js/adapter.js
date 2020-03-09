/**
 * 向小程序通讯，后退、销毁和分享才能获取
 * @param {Object} data 
 */
function postMessage(data) {
  wx.miniProgram.postMessage({ data });
}
/**
 * 整合导航函数
 * @param {Object} param 
 */
function navigate({ method = 'navigateTo', url, delta = 1, success = f => f, fail = f => f, complete = f => f  }) {
  let methods = ['navigateTo', 'switchTab', 'reLaunch', 'redirectTo', 'navigateBack']
  if (methods.indexOf(method) >= 0) {
    let params = {
      success,
      fail,
      complete
    }
    if (method === 'navigateBack') {
      params['delta'] = delta
    } else {
      params['url'] = url
    }
    wx.miniProgram[method](params)
  } else {
    throw new Error(`[${methods}],There is no such method(${method})`)
  }
}
/**
 * 支付
 * @param {Object} params: {money, orderId}
 */
function skipToOrder(params) {
  let url = combineParamsToUrl({
    url: `/pages/h5/pay/index`,
    params
  })
  navigate({
    url
  })
}
/**
 * 分享
 * @param {Object} param 
 */
function skipToShare({ title, path, imageUrl }) {
  let newParams = {
    title,
    path,
    imageUrl
  }
  let url = combineParamsToUrl({
    url: `/pages/h5/share/index`,
    params: newParams
  })
  navigate({
    url
  })
}

function signIn() {
  navigate({
    url: `/pages/h5/login/index?type=signin`
  })
}

function signOut() {
  navigate({
    url: `/pages/h5/login/index?type=signout`
  })
}

function combineParamsToUrl({ url = '', params = {} }) {
  let paramsUrl = combineParams(params)
  if (paramsUrl) {
    url += `?${paramsUrl}`
  }
  return url
}

function combineParams(params) {
  let paramsUrl = ''
  for (let k in params) {
    if (params.hasOwnProperty(k)) {
      paramsUrl += `${k}=${encodeURIComponent(params[k])}&`
    }
  }
  paramsUrl = paramsUrl.slice(0, -1)
  return paramsUrl
}

module.exports = {
  postMessage,
  navigate,
  skipToOrder,
  skipToShare,
  signIn,
  signOut
}