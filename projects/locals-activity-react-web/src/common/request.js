import axios from 'axios'
// import QS from 'qs';
import EnvConfig from '../config/env-config'

const Host = EnvConfig.envConfig.api

axios.defaults.headers.post['Content-Type'] = 'application/json'
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get (url, params, opts) {
  const HOST = url.indexOf('http') !== -1 ? '' : Host
  return new Promise((resolve, reject) => {
    axios
      .get(`${HOST}${url}`, {
        params: params,
        ...opts
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * get方法，对应get请求，允许带options
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} options [请求时携带的额外request参数]
 */
export function getByOptions (url, params, options) {
  const HOST = url.indexOf('http') !== -1 ? '' : Host
  let config = {
    params: params
  }
  if (options != null) {
    Object.entries(options).forEach(e => (config[e[0]] = e[1]))
  }
  console.log(`config:`, config)
  return new Promise((resolve, reject) => {
    axios
      .get(`${HOST}${url}`, config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} options [请求时携带的其他axios参数]
 */
export function post (url, params, options) {
  console.log(url)
  const HOST = url.indexOf('http') !== -1 ? '' : Host
  console.log(HOST)
  return new Promise((resolve, reject) => {
    axios
      .post(`${HOST}${url}`, params, options)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} options [请求时携带的其他axios参数]
 */
export function put (url, params, options) {
  console.log(url)
  const HOST = url.indexOf('http') !== -1 ? '' : Host
  console.log(HOST)
  return new Promise((resolve, reject) => {
    axios
      .put(`${HOST}${url}`, params, options)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
