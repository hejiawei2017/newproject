const { config } = require('../config/config.js')
const moment = require('./dayjs.min.js')

const getQueryString = (url, name) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const res = url.match(reg)
    return res[2]
}
/**
 * 执行打开h5、打开page、打开其他小程序page
 * @param {String} url
 * @param {String} 触发的事件
 * @param {String} 事件标题
 */
const switchNavigate = function (url = '', event = '', title = '') {
    let isHttp = /^(\/https|http)/.test(url)
    let isPagePath = /^(\/pages|pages)/.test(url)
    // 判断url开头是appid=，是则跳转该appid小程序，path为小程序路径
    let isNavigateToMiniProgram = /^(appid=)/.test(url)
    const trackAdsEvent = method => {
        if (event) {
            getApp().mtj.trackEvent(event, {
                value: url, 
                title,
                method, 
            });
        }
    }
    if (isHttp) {
        trackAdsEvent('打开h5')
        wx.navigateTo({
            url: `/pages/web-view/web-view-container/index?url=${url}`
        })
    } else if (isPagePath) {
        trackAdsEvent('跳转小程序页面')
        wx.navigateTo({
            url
        })
    } else if (isNavigateToMiniProgram) {
        const appid = getQueryString(url, 'appid')
        const path = getQueryString(url, 'path')
        const navigateToMiniProgram = (appId, path) => {
            wx.navigateToMiniProgram({
                appId,
                path
            })
        }
        trackAdsEvent('打开其他小程序')
        navigateToMiniProgram(appid, path)
    }
}


const shareMenu = function (type) {
    switch(type) {
        case 'hide':
            wx.hideShareMenu()
            break;
        case 'show':
            wx.showShareMenu()
            break;
    }
}

const showLoading = function (text) {
  wx.showLoading({
    mask: true,
    title: text || '加载中',
  });
}

const isHasLogin = function () {
    let isLogin = wx.getStorageSync('token') && wx.getStorageSync('openId')
    return !!isLogin
}

const isRegisterMobile = function () {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
        if (userInfo.mobile) {
            return true
        } else {
            return true
        }
    } else {
        return false
    }
}

/**
 * promise reject中调用的函数
 * @param {String||Object} msg 错误信息，判断是否少于50字符，否则显示网络不稳定
 */
const catchLoading = function (msg = {}, duration = 2000, callback) {
  // const networkErrorRegExp = /^[\u4e00-\u9fa5]{2,50}$/
  let isError = msg instanceof Error

  let traceId = null
  if (msg) {
    traceId = msg.traceId || ''
  }

  if (msg === 'request:fail timeout') {
    msg = '网络请求超时'
  }

  if (!isError && typeof msg === 'object' && msg !== null) {
    msg = msg.errorDetail || msg.errorMsg
  }

  if (!msg) {
      msg = '网络不稳定'
  }
  
  msg = '' + msg
  wx.hideLoading()
  wx.stopPullDownRefresh()
  wx.showToast({
    duration,
    icon: 'none',
    title: traceId ? `${msg}\n[${traceId}]` : `${msg}`
  })

  setTimeout(() => {
    ;(typeof callback === 'function' && callback())
  }, duration)
}

//身份证号合法性验证 
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
function checkID(code) { 
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;

    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误!";
        pass = false;
    }

   else if(!city[code.substr(0,2)]){
        tip = "身份证地址编码错误!";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(last != code[17]){
                tip = "身份证校验位错误!";
                pass =false;
            }
        }
    }

    return {success: pass, errorMsg: tip};
}

/**
 * 验证规则
 * @param {String} val 被验证值
 * @param {String} type 验证类型： realname(2到15位中文名和英文名) idCard(身份证) passport(护照) compatriots(台胞证) 
 *                               traffic(港澳通行证信息) phone(电话) email(邮件) normal(是否为空))
 *                               password(6到16位密码) code(是否6为数字) price(金额)
 * @param {String} normalMessage 显示错误信息
 * @return {Boolean} 有错误时返回false，否则返回true
 */
function validator(val, type, normalMessage) {
  let newVal = ''
  var phoneExp = new RegExp(/^1[3-9]\d{9}$/),
      emailExp = new RegExp(/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i),
      passwordExp = new RegExp(/^[\S]{6,16}$/),
      codeExp = new RegExp(/\d{6}/),
      priceExp = new RegExp(/^(-?\d+)(\.\d+)?$/),
      idCardExp = new RegExp(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/),
      passportExp = new RegExp(/^[A-Z].[0-9]{7}$/),
      compatriotsExp = new RegExp(/^3\d{7}$/),
      trafficExp = new RegExp(/^[HMhm]{1}([0-9]{10}|[0-9]{8})$/),
      // 只容许2到30位中文名和英文名
      nameRegExp = /^(?:[\u4e00-\u9fa5a-zA-Z\s·]{2,30})$/,
      errorMsg = {
          phone: normalMessage || '请填写有效的手机号',
          email: normalMessage || '请填写有效的邮箱',
          password: normalMessage || '请填写6-16位字符，不能包含空格',
          code: normalMessage || '请填写6位数字',
          price: normalMessage || '请输入数字',
          normal: normalMessage || '',
          select: normalMessage || '',
          idCard: '请填写正确的身份证号格式',
          passport: '请填写正确的护照信息',
          compatriots: '请填写正确的台胞证信息',
          traffic: '请填写正确的港澳通行证信息',
          realname: '请输入正确的名字'
      },
      error = [];
  switch (type) {
      case 'realname':
          if (!nameRegExp.test(val)) {
              error.push(errorMsg.realname);
          }
          break;
      case 'idCard':
          let result = checkID(val)
          if (!result.success) {
              error.push(result.errorMsg);
          }
          break;
      case 'passport':
          newVal = val && val.replace(' ', '')
          if (!newVal) {
              error.push(errorMsg.passport);
          }
          break;
      case 'compatriots':
          newVal = val && val.replace(' ', '')
          if (!newVal) {
              error.push(errorMsg.compatriots);
          }
          break;
      case 'traffic':
          newVal = val && val.replace(' ', '')
          if (!newVal) {
              error.push(errorMsg.traffic);
          }
          break;
      case 'phone':
          if (!phoneExp.test(val)) {
              error.push(errorMsg.phone);
          }
          break;
      case 'email':
          if (!!val && !emailExp.test(val)) {
              error.push(errorMsg.email);
          }
          break;
      case 'normal':
          if (!val && val !== 0) {
              error.push(errorMsg.normal);
          }
          break;
      case 'password':
          if (!passwordExp.test(val)) {
              error.push(errorMsg.password);
          }
          break;
      case 'code':
          if (!codeExp.test(val)) {
              error.push(errorMsg.code);
          }
          break;
      case 'price':
          if (!priceExp.test(val)) {
              error.push(errorMsg.price);
          }
          break;
  }

  if (error.length > 0) {
      wx.showToast({
        title: error[0],
        icon: 'none'
      });
      return false;
  }
  return true;
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const dataFormat = function (d, fmt = 'yyyy-MM-dd') {
    // 日期格式化
    if (!d) {
        return ''
    }
    try {
        if(typeof d === 'string' && d > 0)d = Number(d)
        let date = new Date(d)
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + ''
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
            }
        }
        return fmt
    } catch (error) {
        return ''
    }
}

/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}
function getDiffDays (startDate, endDate) {
  let startDateTemp = moment(startDate).format('YYYY-MM-DD')
  let endDateTemp = moment(endDate).format('YYYY-MM-DD')
  var now = moment(startDateTemp); //todays date
  var end = moment(endDateTemp); // another date
  var days = now.diff(end, 'days');
  return -Math.round(days)
}

/**
 * 获取一段时间之间的倒计时
 * @param {*} startTime 开始时间错
 * @param {*} endTime 结束时间戳
 */
function getDistanceTime (startTime, endTime) {
    const distance = endTime - startTime
    let {day, hour, minute, second} = 0
    if (distance < 0) return -1
    day = Math.floor(distance/1000/60/60/24);
    hour = Math.floor(distance/1000/60/60%24);
    minute = Math.floor(distance/1000/60%60);
    second = Math.floor(distance/1000%60);

    return {day, hour, minute, second}

}

const getNewImagePrefix = (url) => {
  if(typeof url !== "string")return ""
  if((url.includes("/upload/") || url.includes("Article")) && (!url.includes("http"))){
      return (config.newImagePrefix + url)
  }
  return url
}

const getMSdate = (data) => {
  var d = new Date(data)
  var times =(d.getMonth() + 1) + '.' + d.getDate()
  return times
}

const processFloat = (value, decimal = 2) => {
    if (typeof value !== 'number') {
        throw new Error('value is not number')
    }
    if (decimal <= 0) {
        return Math.round(value)
    }
    let multiplier = Math.pow(10, decimal)
    return Math.round(value * multiplier) / multiplier
}

const parseUrlParams = url => {
    let index = url.indexOf('?')
    if (index > -1) {
        let paramsString = url.slice(index + 1)
        let paramsArray = paramsString.split('&')
        let paramsObj = {}
        for (let item of paramsArray) {
          let [key, value] = item.split('=')
          if (value) {
            paramsObj[key] = value
          }
        }
        return paramsObj
    } else {
        return false
    }
}

function deepCompare(x, y) {
    var i, l, leftChain, rightChain;
  
    function compare2Objects(x, y) {
        var p;
  
        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }
  
        // Compare primitives and functions.     
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true;
        }
  
        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }
  
        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }
  
        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }
  
        if (x.constructor !== y.constructor) {
            return false;
        }
  
        if (x.prototype !== y.prototype) {
            return false;
        }
  
        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }
  
        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }
  
        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
  
            switch (typeof(x[p])) {
                case 'object':
                case 'function':
  
                    leftChain.push(x);
                    rightChain.push(y);
  
                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }
  
                    leftChain.pop();
                    rightChain.pop();
                    break;
  
                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }
  
        return true;
    }
  
    if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
    }
  
    for (i = 1, l = arguments.length; i < l; i++) {
  
        leftChain = []; //Todo: this can be cached
        rightChain = [];
  
        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }
  
    return true;
  }

//替换为改版新图片 lhk 2019.08.02
function switchCardImage(memberCardCode) {
    if (memberCardCode) {
        memberCardCode = memberCardCode.toUpperCase()
    }
    switch (memberCardCode) {
        case 'NORMAL':
            return 'https://oss.localhome.cn//localhomeqy/mine/mine_card4%402x.png'
        case 'SILVER':
            return 'https://oss.localhome.cn//localhomeqy/mine/mine_card3%402x.png'
        case 'GOLD':
        return 'https://oss.localhome.cn//localhomeqy/mine/mine_card2%402x.png'
            case 'BLACK':
        return 'https://oss.localhome.cn//localhomeqy/mine/mine_card1%402x.png'
    }
}

// 图片格式化
function processImage(imgPath) {
  if (imgPath) {
    // 修正window的路径的正斜杠
    imgPath = imgPath.replace("/\\/g", "\/")

    // 判断是否ali oss
    if (imgPath.indexOf('aliyuncs.com') !== -1 && imgPath.indexOf('?x-oss-process') === -1) {
      return encodeURI(imgPath + '?x-oss-process=image/resize,w_640/quality,Q_100')
    }

    // http图片路径直接返回不用处理
    if (imgPath.indexOf('http') != -1) {
      return encodeURI(imgPath)
    }
    // 处理cdn路径
    if (imgPath.indexOf('/UploadFiles/') != -1) {
      return encodeURI("http://f.localhome.cn" + imgPath)
    }
    // 处理cdn路径
    if (imgPath.indexOf('/upload/') != -1) {
      return encodeURI("http://f.localhome.cn" + imgPath)
    }
    // 图片设施
    if (imgPath.indexOf('/Content/') != -1) {
      return encodeURI("http://app.localhome.cn" + imgPath)
    }
    // 如果file开头,本地文件,跳过处理
    if (imgPath.indexOf('file') != -1) {
      return imgPath
    }
    // 签名图
    if (imgPath.indexOf('/temp/') != -1) {
      var newPath = encodeURI("http://qy.localhome.com.cn/locals" + imgPath)
      return newPath
    }
    // 新服务图片URL
    return encodeURI("http://120.76.204.105" + imgPath)
  }
  return ''
}
// 分享参数格式化
function shareDataFormat (data = {}) {
    const selfInviteCode = wx.getStorageSync('selfInviteCode') || '';
    const inviteCode = wx.getStorageSync('inviteCode') ? wx.getStorageSync('inviteCode') : selfInviteCode;
    if(inviteCode && data.path && data.path.indexOf('inviteCode=') === -1){
        data.path = data.path.indexOf('?') !== -1 ? `${data.path}&inviteCode=${inviteCode}` : `${data.path}?inviteCode=${inviteCode}`
    }
    return data
}

/**
 * 防抖/节流函数
 * @param {执行函数} fn 
 * @param {延迟时间} delay
 * @param {节流时间} mustRunDelay
 */
function throttle(fn, delay, mustRunDelay){
    var timer = null;
    var t_start;
    return function(){
        var context = this, args = arguments, t_curr = +new Date();
        clearTimeout(timer);
        if(!t_start){
            t_start = t_curr;
        }
        if(t_curr - t_start >= mustRunDelay){
            fn.apply(context, args);
            t_start = t_curr;
        }
        else {
            timer = setTimeout(function(){
                fn.apply(context, args);
            }, delay);
        }
    };
};
/**
 * 数组转字符串
 * @param {执行数组} arr
 * @param {分割符号} sign
 */
function arrayToString(arr, sign = ','){
  if (arr instanceof Array && arr && arr.length !== 0) return arr.join(sign)
  else return
}

/*获取当前页url*/
function getCurrentPageUrl(){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length-1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    return url
}

function isEmptyObj(obj) {
    if (typeof obj !== 'object' || obj === null) {
        console.warn('obj is not object');
        return false;
    }
    return !(Object.keys(obj).length > 0)
}

/**
 * 分解格式化url参数
 * @param {字符串} queryScene
 */
function formatParams(queryScene){
    if (queryScene) {
        const _scene = decodeURIComponent(queryScene)
        const params = {}
        const seg = _scene.split('&')
        const len = seg.length
        for (let i = 0; i < len; i++) {
            if (seg[i]) {
            const p = seg[i].split('=')
            params[p[0]] = p[1];
            }
        }
        return params
    } else {
        return {}
    }
}
/**
 * gio自定义事件上报
 * @param {标识符} eventName
 * @param {数据} data
 */
function gioTrack(eventName, data = {}){
    getApp().globalData.gio('track', eventName,data);
}

//数字星期转中文(周日开始)
function weekNumToCN(num) {
    switch (num) {
        case 0:
            return '日'
        case 1:
            return '一'
        case 2:
            return '二'
        case 3:
            return '三'
        case 4:
            return '四'
        case 5:
            return '五'
        case 6:
            return '六'

    }
}

//遮挡电话号码
function maskPhone(phone) {
    return phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : '';
}


function stringifyURL(url, query) {
    if (typeof url !== "string") {
      console.warn(`url 类型不是 String`);
    }
    url = url.split("?")[0];
    query = Object.keys(query)
      .filter(k => query[k])
      .map(k => {
        return `${k}=${query[k]}`;
      })
      .join("&");
    return `${url}?${query}`;
  }

module.exports = {
  formatTime,
  formatTime2,
  dataFormat,
  formatNumber,
  wxPromisify,
  getDiffDays,
  validator,
  showLoading,
  catchLoading,
  getNewImagePrefix,
  getMSdate,
  isHasLogin,
  isRegisterMobile,
  shareMenu,
  processFloat,
  parseUrlParams,
  deepCompare,
  switchCardImage,
  processImage,
  shareDataFormat,
  switchNavigate,
  throttle,
  isEmptyObj,
  arrayToString,
  getCurrentPageUrl,
  getDistanceTime,
  formatParams,
  gioTrack,
  weekNumToCN,
  maskPhone,
  stringifyURL
}
