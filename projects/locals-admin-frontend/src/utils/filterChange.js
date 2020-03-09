import { checkType } from '../utils/utils'
/**
 * orderBy 当前 筛选条件
 * sorter 筛选类
 * keys 筛选key值数组 [{key:'',str: ''}]
 */
const filterChange = (orderBy = "", sorter, keys) => {
    console.log(orderBy, sorter, keys)
    if(!checkType.isArray(keys)){
        return false
    }
    if(sorter.field){
        const keyStr = keys.filter(i => i.key === sorter.field)[0].str
        const acitonStr = `${keyStr} ${sorter.order === "descend" ? "desc" : "asc"}`
        return orderBy === acitonStr ? false : acitonStr
    }else if((!sorter.field) && orderBy.length > 0){
        return ''
    }
    return false
}
export default filterChange