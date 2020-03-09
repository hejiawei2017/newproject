import { setCookie, getCookie, delCookie, clearAllCookie } from "./cookie"
import Global from "./Global"
import moment from 'moment'
const env = process.env.MY_ENV || 'dev'
// const env = process.env.MY_ENV || 'pre'
window.env = env

let envConfig = {
    'dev':{
        // prod
        // api:"http://ms.localhome.cn/api",
        // middlewareApi:"https://i.localhome.cn/api",
        // imgPrefix:"http://app.localhome.cn",
        // newImagePrefix:"http://120.76.204.105",
        // designImagePrefix:"http://qy.localhome.com.cn/locals",
        // fileUrl:'http://120.76.204.105'
        // uat
        api:"http://dev.localhome.cn/api",
        middlewareApi:"http://tp.localhome.cn:9999/api",
        imgPrefix:"http://f.localhome.cn",//房源图片
        newImagePrefix:"http://locals-house-test.oss-cn-shenzhen.aliyuncs.com",//上传图片
        pcUrl:"http://tp.localhome.cn:9094",//pc官网
        mobileURL:"http://tp.localhome.cn:9095",//移动端官网
        designImagePrefix:"http://qy.localhome.com.cn/locals",// 签名图片
        walletUrl:(token)=>(`http://tp.localhome.cn:9090/newaccounting/wallet/index/${token}/AAA/story`),// 钱包地址
        // fileUrl:'http://192.168.0.215:9092'
        fileUrl:'http://locals-house-test.oss-cn-shenzhen.aliyuncs.com',
        wxShareUrl: 'https://f.localhome.cn/devInsurance'
    },
    'test':{
        api:"http://test.localhome.cn/api",
        imgPrefix:"http://f.localhome.cn",
        newImagePrefix:"http://locals-house-test.oss-cn-shenzhen.aliyuncs.com",
        pcUrl:"http://tp.localhome.cn:7094",//pc官网
        mobileURL:"http://tp.localhome.cn:7095",//移动端官网
        designImagePrefix:"http://qy.localhome.com.cn/locals",
        walletUrl:(token)=>(`http://tp.localhome.cn:7090/newaccounting/wallet/index/${token}/AAA/story`),// 钱包地址
        // fileUrl:'http://192.168.0.215:9092'
        fileUrl: 'http://locals-house-test.oss-cn-shenzhen.aliyuncs.com',//临时下载文件地址 到时候改测试的
        wxShareUrl: 'https://f.localhome.cn/testInsurance'
    },
    'pre':{
        api:"http://pre.localhome.cn/api",
        imgPrefix:"http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com",
        newImagePrefix:"http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com",
        pcUrl:"http://tp.localhome.cn:6094",//pc官网
        mobileURL:"http://tp.localhome.cn:6095",//移动端官网
        designImagePrefix:"http://qytest.localhome.com.cn/locals",
        walletUrl:(token)=>(`http://tp.localhome.cn:6090/newaccounting/wallet/index/${token}/AAA/story`),// 钱包地址
        // fileUrl:'http://192.168.0.215:9092'
        fileUrl: 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com',//临时下载文件地址 到时候改测试的
        wxShareUrl: 'https://f.localhome.cn/preInsurance'
    },
    'prod':{
        api:"https://ms.localhome.cn/api",
        middlewareApi:"https://i.localhome.cn/api",
        imgPrefix:"http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com",//线上房源图片
        newImagePrefix:"http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com",
        designImagePrefix:"http://qy.localhome.com.cn/locals",
        fileUrl:'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com',
        walletUrl:(token)=>(`http://mobile.localhome.com.cn/newaccounting/wallet/index/${token}/AAA/story`),// 钱包地址
        wxShareUrl: 'http://f.localhome.cn/preInsurance'
    }
}
envConfig = envConfig[env]

const dateDiff = (sDate, eDate) =>{
    let sdate = new Date(sDate)
    let edate = new Date(eDate)
    const y = Math.abs(edate.getFullYear() - sdate.getFullYear());
    const m = Math.abs(edate.getMonth() - sdate.getMonth());
    const d = Math.abs(edate.getDate() - sdate.getDate());
    // 如果年月日都相等，那肯定是同一天
    if (y === 0 && m === 0 && d === 0) {
        return 0;
    } else {
    // 否则今天算一天，然后计算从明天的0点到结束的日期共经过多少个"24小时"
    // 向下取整，最后加1天，就是真正的从开始日期到结束日期过了几天
        const last = new Date(sdate.getFullYear(), sdate.getMonth(), sdate.getDate() + 1, 0, 0, 0);
        const diff = Math.floor((edate - last) / 1000 / 60 / 60 / 24);
        return 1 + diff;
    }
}

const getStandardDateBeforeWeek = (time) =>{
    let _date = new Date(time); //获取今天日期
        _date.setDate(_date.getDate() - 7);//日期回到七天前
    let year = _date.getFullYear();
    let month = _date.getMonth() + 1;
    let day = _date.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    let dateTemp = year + '-' + month + '-' + day;
    _date.setDate(_date.getDate() + 7);//日期重置
    return dateTemp;
}

const getFixNewImagePrefix = (url) => {
    if(typeof url !== "string")return ""
    if((url.includes("/upload/") || url.includes("Article") || url.includes("UploadFiles")) && (!url.includes("http"))){
        return (envConfig.imgPrefix + url)
    }
    return url
}

const getSpeImagePrefix = (url) => {
    if(typeof url !== "string")return ""
    if(url.includes("/upload/") && (!url.includes("http"))){
        return (envConfig.newImagePrefix + url)
    }else if(url.includes("UploadFiles") && (!url.includes("http"))){
        return (envConfig.imgPrefix + url)
    }
    return url
}

const getNewImagePrefix = (url) => {
    if(typeof url !== "string")return ""
    if((url.includes("/upload/") || url.includes("Article")) && (!url.includes("http"))){
        return (envConfig.newImagePrefix + url)
    }
    return url
}

const getImgPrefix = (url) => {
    if(typeof url !== "string")return ""
    if(url.includes("/upload/") || !url.includes("http")){
        return (envConfig.imgPrefix + url)
    }
    return url
}

const onExit = function () {
    // 退出
    return new Promise((resolve, reject) => {
        sessionStorage.clear()
        clearAllCookie()
        Global.userInfo = {}
        Global.role = []
        Global.pathName = ''
        // window.location.reload()
        resolve({success: true})
    })
}
// 正则
const reg = {
    tel: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
    chinese: /[\u4e00-\u9fa5]{1}/,
    int: /^[1-9]\d*$/,
    intDot: /^([1-9]\d*|0)(\.\d{1,2})?$/
}

const pageOption = {
    // 分页公共object
    pageSizeOpts: ['10','20','30','50','100','500','2000'],
    pageNum: 1,
    pageSize: 10
}
const dataFormat = function (d, fmt = 'YYYY-MM-DD') {
    // 日期格式化
    if (!d) {
        return ''
    }
    try {
        return moment(d).format(fmt)
    } catch (error) {
        return ''
    }
}

// formatMoney(sum) 序列化货币 500,000.00
function formatMoney (number, places, symbol, thousand, decimal) {
    number = number || 0
    places = !isNaN(places = Math.abs(places)) ? places : 2
    symbol = symbol !== undefined ? symbol : "" // $
    thousand = thousand || ","
    decimal = decimal || "."
    var negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j
        j = (j = i.length) > 3 ? j % 3 : 0
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "")
}

function checkKey (list) {
    let items = list
    if(checkType.isArray (items)){
        for(let i in items){
            if (items[i] && items[i]['key']) {
                items[i]['key'] = createUUID()
            }
        }
    }
    return items
}

function getNowTime (){
    return new Date().getTime()
}

function checkPhone (val){
    if(val && val.indexOf('(X)') >= 0){
        return ''
    }else{
        return val
    }
}

function createUUID (t = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',ary = 16){
    var d = getNowTime ()
    var uuid = t.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * ary) % ary | 0
        d = Math.floor(d / ary)
        return (c === 'x' ? r : ((r && 0x7) || 0x8)).toString(ary)
    })
    return uuid
}

const checkType = {
    isNumber : function (arg){
        return Object.prototype.toString.call(arg) === '[object Number]'
    },
    isString : function (arg){
        return Object.prototype.toString.call(arg) === '[object String]'
    },
    isUndefined : function (arg){
        return Object.prototype.toString.call(arg) === '[object Undefined]'
    },
    isBoolean : function (arg){
        return Object.prototype.toString.call(arg) === '[object Boolean]'
    },
    isObject : function (arg){
        return Object.prototype.toString.call(arg) === '[object Object]'
    },
    isArray : function (arg){
        return Object.prototype.toString.call(arg) === '[object Array]'
    },
    isFunction : function (arg){
        return Object.prototype.toString.call(arg) === '[object Function]'
    },
    isEmpty: function (s) {
        return typeof (s) === "undefined" || s === null || s === "" || s.toString().trim() === ""
    }
}

const inputNumberFormat = flag => value => `${value}${flag}`

const inputNumberPercent = flag => value => value.replace(flag, '')
const formatSelectOption = srcType => {
    if (!checkType.isObject(srcType))
        throw new Error('Array required!')
    let targetType = []

    for (let [key, val] of Object.entries(srcType)) {
        targetType.push({
            text: val,
            value: key
        })
    }

    return targetType
}

/*
* 搜索select的数据源，转换
* @params 源数据
* @params 源数据的【描述】字段名
* @params 源数据的【值】字段名
* @params 生成现数据的【描述】字段名，默认是'text'
* */
function searchObjectSwitchArray (obj,textName,valName, keyName) {
    let arr = []
    let _keyName = keyName || 'text'
    for (const key in obj) {
        if(!!textName && !!valName){
            arr.push({
                value: obj[key][valName],
                [_keyName]: obj[key][textName]
            })
        }else{
            if(key === ''){
                arr.unshift({value: key, [_keyName]: obj[key]})
            }else{
                arr.push({value: key, [_keyName]: obj[key]})
            }
        }
    }
    return arr
}

// 计算表格宽度
function getTableWidth (columns) {
    let arr = []
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].children) {
            for (let j = 0; j < columns[i].children.length; j++) {
                arr.push(columns[i].children[j].width)
            }
        } else {
            arr.push(columns[i].width)
        }
    }
    if (arr.length > 0) {
        return arr.reduce((prev, curr, idx, arr) => prev + curr)
    }
}

function mapToArr (arrMap) {
    let arr = [];
    for (let i in arrMap){
        arr.push({value: i, text: arrMap[i]})
    }
    return arr
}

/**
 * @description 防抖函数，常用于某些事件频繁触发时，只需要在特定时点执行绑定这些事件的函数
*/

function debounce (func, wait, immediate) {
    let triggerPoint // 事件触发时点
    let context
    let args
    let result
    let timeout
    let logicFunc = function () {
        let last = Date.now() - triggerPoint
        if (last < wait && last > 0) {
            timeout = setTimeout(logicFunc, wait - last)
        } else {
            timeout = null
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function () {
        context = this
        args = arguments
        triggerPoint = Date.now()

        var callNow = immediate && !timeout
        if (!timeout) timeout = setTimeout(logicFunc, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }
        return result
    }
}

function formCall (url, params, target = "_blank" , method = "post"){
    let tempform = document.createElement("form")
    let opt = ""
    tempform.action = url
    tempform.method = method
    tempform.style.display = "none"
    if(target) {
        tempform.target = target
    }
    for (let x in params) {
        opt = document.createElement("input")
        opt.name = x;
        opt.value = params[x];
        tempform.appendChild(opt)
    }
    opt = document.createElement("input")
    opt.type = "submit"
    tempform.appendChild(opt)
    document.body.appendChild(tempform)
    tempform.submit()
    document.body.removeChild(tempform)
}

/**
 * @description 字符串转json，key=value&key1=value2 转{key:value,key1:value2}
*/
function getQueryObject (str) {
    let obj = {}
    let reg = /([^?&=]+)=([^?&=]*)/g
    str.replace(reg, function (rs, $1, $2) {
        let name = decodeURIComponent($1)
        let val = decodeURIComponent($2)
        val = String(val)
        obj[name] = val
        return rs
    })
    return obj
}

export {
    envConfig,
    dateDiff,
    getStandardDateBeforeWeek,
    getFixNewImagePrefix,
    getSpeImagePrefix,
    getNewImagePrefix,
    getImgPrefix,
    onExit,
    setCookie,
    getCookie,
    delCookie,
    clearAllCookie,
    reg,
    pageOption,
    dataFormat,
    createUUID,
    checkType,
    searchObjectSwitchArray,
    checkKey,
    inputNumberFormat,
    inputNumberPercent,
    formatSelectOption,
    formatMoney,
    getTableWidth,
    mapToArr,
    debounce,
    checkPhone,
    formCall,
    getQueryObject
}
