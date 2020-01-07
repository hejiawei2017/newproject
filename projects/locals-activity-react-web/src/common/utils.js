/**
 * 验证规则
 * @param {String} val 被验证值
 * @param {String} type 验证类型： realname(2到15位中文名和英文名) idCard(身份证) passport(护照) compatriots(台胞证)
 *                               traffic(港澳通行证信息) phone(电话) email(邮件) normal(是否为空))
 *                               password(6到16位密码) code(是否6为数字) price(金额)
 * @param {String} normalMessage 显示错误信息
 * @return {Boolean} 有错误时返回false，否则返回true
 */
function validator (val, type, normalMessage) {
  let newVal = ''
  var phoneExp = new RegExp(/^1[3-9]\d{9}$/),
    emailExp = new RegExp(
      // eslint-disable-next-line no-useless-escape
      /^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i
    ),
    passwordExp = new RegExp(/^[\S]{6,16}$/),
    codeExp = new RegExp(/\d{6}/),
    priceExp = new RegExp(/^(-?\d+)(\.\d+)?$/),
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
    error = []
  // eslint-disable-next-line default-case
  switch (type) {
    case 'realname':
      if (!nameRegExp.test(val)) {
        error.push(errorMsg.realname)
      }
      break
    case 'idCard':
      let result = checkID(val)
      if (!result.success) {
        error.push(result.errorMsg)
      }
      break
    case 'passport':
      //if (!passportExp.test(val)) {
      newVal = val.replace(' ', '')
      if (!newVal) {
        error.push(errorMsg.passport)
      }
      break
    case 'compatriots':
      // if (!compatriotsExp.test(val)) {
      newVal = val.replace(' ', '')
      if (!newVal) {
        error.push(errorMsg.compatriots)
      }
      break
    case 'traffic':
      //if (!trafficExp.test(val)) {
      newVal = val.replace(' ', '')
      if (!newVal) {
        error.push(errorMsg.traffic)
      }
      break
    case 'phone':
      if (!phoneExp.test(val)) {
        error.push(errorMsg.phone)
      }
      break
    case 'email':
      if (!val || !emailExp.test(val)) {
        error.push(errorMsg.email)
      }
      break
    case 'normal':
      if (!val && val !== 0) {
        error.push(errorMsg.normal)
      }
      break
    case 'password':
      if (!passwordExp.test(val)) {
        error.push(errorMsg.password)
      }
      break
    case 'code':
      if (!codeExp.test(val)) {
        error.push(errorMsg.code)
      }
      break
    case 'price':
      if (!priceExp.test(val)) {
        error.push(errorMsg.price)
      }
      break
  }

  if (error.length > 0) {
    return false
  }
  return true
}
//身份证号合法性验证
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
function checkID (code) {
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  }
  var tip = ''
  var pass = true

  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
      code
    )
  ) {
    tip = '身份证号格式错误!'
    pass = false
  } else if (!city[code.substr(0, 2)]) {
    tip = '身份证地址编码错误!'
    pass = false
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      code = code.split('')
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      var sum = 0
      var ai = 0
      var wi = 0
      for (var i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }
      var last = parity[sum % 11]
      if (last !== code[17]) {
        tip = '身份证校验位错误!'
        pass = false
      }
    }
  }

  return { success: pass, errorMsg: tip }
}
function parseURL (url) {
  var a = document.createElement('a')
  a.href = url
  // var a = new URL(url);
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      const searchStr = url.split('?')[1] || ''
      var params = {},
        seg = searchStr.replace(/^\?/, '').split('&'),
        len = seg.length,
        p
      for (var i = 0; i < len; i++) {
        if (seg[i]) {
          p = seg[i].split('=')
          params[p[0]] = p[1]
        }
      }
      return params
    })(),
    hash: a.hash.replace('#', ''),
    // eslint-disable-next-line no-useless-escape
    path: a.pathname.replace(/^([^\/])/, '/$1')
  }
}

function parseHashURL (url) {
  var a = document.createElement('a')
  a.href = url
  // var a = new URL(url);
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      const searchStr = window.location.search.split('?')[1] || ''
      var params = {},
        seg = searchStr.replace(/^\?/, '').split('&'),
        len = seg.length,
        p
      for (var i = 0; i < len; i++) {
        if (seg[i]) {
          p = seg[i].split('=')
          params[p[0]] = p[1]
        }
      }
      debugger
      return params
    })(),
    hash: a.hash.replace('#', ''),
    // eslint-disable-next-line no-useless-escape
    path: a.pathname.replace(/^([^\/])/, '/$1')
  }
}

function formatTime (dateTimeStamp) {
  const date = new Date(parseInt(dateTimeStamp))
  const Y = date.getFullYear() + '-'
  const M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  const D = date.getDate() < 10 ? `0${date.getDate()} ` : date.getDate() + ' '
  const h =
    date.getHours() < 10 ? `0${date.getHours()}:` : date.getHours() + ':'
  const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  const result = Y + M + D + h + m
  return result
}

//获取url参数
function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let hash = window.location.hash.replace('#/?', '').replace('?', '')
  var r = hash.match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

function setTitle (title) {
  document.title = title
}

var jsUrlHelper = {
  getUrlParam: function (url, ref) {
    var str = ''

    // 如果不包括此参数
    if (url.indexOf(ref) === -1) return ''

    str = url.substr(url.indexOf('?') + 1)

    var arr = str.split('&')
    for (var i in arr) {
      var paired = arr[i].split('=')

      if (paired[0] === ref) {
        return paired[1]
      }
    }

    return ''
  },
  putUrlParam: function (url, ref, value) {
    // 如果没有参数
    if (url.indexOf('?') === -1) return url + '?' + ref + '=' + value

    // 如果不包括此参数
    if (url.indexOf(ref) === -1) return url + '&' + ref + '=' + value

    var arr_url = url.split('?')

    var base = arr_url[0]

    var arr_param = arr_url[1].split('&')

    for (var i = 0; i < arr_param.length; i++) {
      var paired = arr_param[i].split('=')

      if (paired[0] === ref) {
        paired[1] = value
        arr_param[i] = paired.join('=')
        break
      }
    }

    return base + '?' + arr_param.join('&')
  },
  delUrlParam: function (url, ref) {
    // 如果不包括此参数
    if (url.indexOf(ref) === -1) return url
    var arr_url = url.split('?')
    var base = arr_url[0]
    var arr_param = arr_url[1].split('&')
    var index = -1
    for (var i = 0; i < arr_param.length; i++) {
      var paired = arr_param[i].split('=')
      if (paired[0] === ref) {
        index = i
        break
      }
    }
    if (index === -1) {
      return url
    } else {
      arr_param.splice(index, 1)
      return base + '?' + arr_param.join('&')
    }
  }
}

function gioTrack (eventName, data = {}) {
  window.gio('track', eventName, data)
}

export default {
  validator,
  parseURL,
  formatTime,
  getQueryString,
  parseHashURL,
  setTitle,
  jsUrlHelper,
  gioTrack
}
