import { checkType } from './utils'

/**
 *  一维数组转换多维
 * @param {*} data 传入的数组
 * @param {*} parentIdKey // parent 取值名
 * @param {*} parentKey // 子key 取值名
 * @param {*} child child key 名
 * @param {*} itemFn 修改item的key值
 * @param {*} arrayObj 初始化数据对象
 * @param {*} isChileren // 是否进入数组判断
 * @param {*} Level // 层级
 */

const setArrayToData = (data, parentIdKey = 'parentId', parentKey = 'id', child = 'child', itemFn, isChileren, Level = 0, arrayObj = {}) => {
    let arrayData = []
    let datas = [...data].sort((a, b) => a[parentKey] - b[parentKey])
    datas.map((item) => {
        if (isChileren && isChileren(item)) {
            return item
        }
        item.key = `arrayData-${item.name}-${item[parentIdKey] || ''}-${item[parentKey]}`
        item[child] = {}
        if (itemFn) {
            item = {
                ...item,
                ...itemFn(item)
            }
        }
        if (item[parentIdKey]) {
            let itemIndex = arrayDataMap(arrayObj, item[parentIdKey], child, Level)
            itemIndex && (itemIndex[child][item[parentKey]] = item)
        } else {
            arrayObj[item[parentKey]] = item
        }
        return item
    })
    arrayData = forObject(arrayObj, child)
    return arrayData
}
const forObject = (arrayObj, child) => {
    let arr = []
    for (const key in arrayObj) {
        let item = arrayObj[key]
        if (item[child]) {
            item[child] = forObject(item[child], child)
        }
        arr.push(item)
    }
    return arr
}
const arrayDataMap = (arrayObj, parentId, child, Level, newLevel = 1) => {
    for (const key in arrayObj) {
        if (Number(key) === Number(parentId)) {
            return arrayObj[key]
        } else if (Level === 0 || Level > newLevel) {
            let mapData = arrayDataMap(arrayObj[key][child], parentId, child, Level, newLevel + 1)
            if (mapData) return mapData
        }
    }
}


const getArrayValueToparent = ( arrayData, parentKey, chileKey, valueKey, value ) =>{
    let activeArr = []
    let activeObj = {}
    let parentValue = ''
    if(value && checkType.isArray(arrayData)){
        arrayData.map((item)=>{
            activeObj[item[chileKey]] = item
            if(item[valueKey] === value){
                activeArr.push(item[chileKey])
                parentValue = item[parentKey]
            }
            return item
        })
    }
    if(parentValue){
        let arr = getArrayToparent(activeObj,parentKey, chileKey, parentValue)
        if(arr.length > 0){
            activeArr = arr.concat(activeArr)
        }
    }
    return activeArr
}
const getArrayToparent = ( arrayData, parentKey, chileKey, value ) =>{
    let activeArr = []
    let item = arrayData[value]
    if(item){
        activeArr.unshift(item[chileKey])
        if(item[parentKey]){
            let arr = getArrayToparent(arrayData, parentKey, chileKey, item[parentKey])
            if(arr){
                activeArr = arr.concat(activeArr)
            }
        }
    }
    return activeArr
}


export {
    setArrayToData,
    getArrayValueToparent,
    getArrayToparent
}