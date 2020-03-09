import Global from './Global.js'
const hostName = window.location.hostname
let hostname = hostName.replace(/\./g,'') > 0 ? hostName : hostName.substring(hostName.indexOf(".") + 1)

// 写cookies（设置作用域）
const setCookie = (name, value) => {
    var Days = 30
    var exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";domain=" + hostname + ";path=/"
}

//读取cookies
const getCookie = (name) => {
    const reg = new RegExp("(^| )" + name + "=([^]*)(|$)"),
        arr = document.cookie.match(reg)
    if (arr)
        return (arr[2])
    else
        return null
}

//删除cookies
const delCookie = (name) => {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = getCookie(name)
    if (cval != null)
        document.cookie = name + "=" + cval + "expires=" + exp.toGMTString()
}

const clearAllCookie = () => {
    var keys = document.cookie.match(/[^ =;]+(?=)/g)
    if(keys) {
        for(var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}

// //删除cookies（有作用域的）
// function delCookie(name) {
//     var exp = new Date()
//     var name = "access_token"
//     exp.setTime(exp.getTime() - 1)
//     var cval = getCookie(name)
//     if (cval != null) {
//         document.cookie = name + "=''expires=" + exp.toGMTString() + "domain=" + hostname + "path=/"
//     }
// }

export {
    setCookie,
    getCookie,
    delCookie,
    clearAllCookie
}