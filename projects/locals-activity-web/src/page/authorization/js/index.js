import 'babel-polyfill'
import {
  getParam
} from "../../../js/util"

$(function () {
  init()

  async function init () {
    // 获取参数
    let code = getParam('code') 
    if (!code) {
      let { href } = location
      href = encodeURIComponent(href)
      let { data: openWeixinUrl } = await authUrl(href)
      location.replace(openWeixinUrl)
    } else {
      // 需要考虑传入的url也带有参数
      let url = getParam('url')
      if (!url) {
        return false
      }
      url = decodeURIComponent(url)
      if (url.indexOf('?') > -1) {
        url += `&code=${code}`
      } else {
        url += `?code=${code}`
      }
      // 重定向url
      location.replace(url)
    }
  }

  function getApi() {
      let prefix = {
          'dev': 'dev',
          'test': 'test',
          'pre': 'pre',
          'prod': 'ms'
      }
      let api = prefix[getParam('env')] || prefix['prod']
      return `https://${api}.localhome.cn/api`
  }

  /** 授权登录 */
  function authUrl(url) {
    url = decodeURIComponent(url)
    let path = '/wechat/wechat/auth-url';
    if (url.indexOf('authType') !== -1) {
      path='/wechat/wechat/static/auth-url'
    }
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "POST", 
        headers: {
          "Content-type": "application/json"
        },
        dataType: "json",
        url: getApi() + path,
        data: JSON.stringify({
          url
        }),
        success: function(res) {
          if (res.success) {
            resolve(res);
          } else {
            resolve(false);
          }
        },
        error: function() {
          reject(false);
        }
      });
    });
  }
})