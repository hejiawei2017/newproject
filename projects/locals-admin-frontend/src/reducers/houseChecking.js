import { handleActions } from 'redux-actions'

const houseImgsOrder = ['主图','客厅','书房','卧室1','卧室2','卧室3','卧室4','卧室5','卧室6','卧室7','卧室8','阳台','阳台1','阳台2','阳台3','厨房','公共卫生间','公共卫生间1','公共卫生间2','公共卫生间3','其他','空']

function sortImgs (action){
    let dist = {}
    // 轮播图列表根据记录的 module 和 orderNumber 进行排序
    // 根据记录的 module 进行排序，排列顺序为 houseImgsOrder

    // 按 module 进行分组
    houseImgsOrder.forEach(name => {
        if (name === null) {
            dist['空'] = []
        } else {
            dist[name] = []
        }

    })
    action.payload.forEach(item => {
        if (item.module === null) {
            dist['空'].push(item)
        } else {
            console.log(dist[item.module])
            console.log(dist[item.module] && dist[item.module] instanceof Array)
            if (dist[item.module] && dist[item.module] instanceof Array) {
                dist[item.module].push(item)
            } else {
                dist[item.module] = []
                dist[item.module].push(item)
            }
        }
    })

    // module 分组中，按 orderNumber 进行排序
    for (let key in dist) {
        dist[key].sort((pre, next) => pre.orderNumber - next.orderNumber)
    }

    let ret = []
    // 将字典的分类数组根据 module 顺序生成
    houseImgsOrder.forEach(name => {
        ret = [...ret, ...dist[name]]
    })

    return ret
}

function sortNewAndOldImgs (action){
    let dist = []
    action.payload.forEach(item => {
        if (item.images && item.images.length > 0) {
            item.images.forEach(i =>{
                i.module = item.module //添加模块
                dist.push(i)
            })
        }
    })
    return dist
}

export const dataDetail = handleActions({
    'GET_DATA_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const imagesDetail = handleActions({
    'GET_IMAGES_SUCCESS' (state, action) {
        return sortImgs(action)
    }
}, [])

export const horizontalImages = handleActions({
    'GET_HORIZONTAL_SUCCESS' (state, action) {
        return sortImgs(action)
    }
}, [])

export const imagesNewAndOldDetail = handleActions({
    'GET_NEW_OLD_IMAGES_SUCCESS' (state, action) {
        return sortNewAndOldImgs(action)
    }
}, [])

export const horizontalNewAndOldImages = handleActions({
    'GET_NEW_OLD_HORIZONTAL_SUCCESS' (state, action) {
        return sortNewAndOldImgs(action)
    }
}, [])

export const facilities = handleActions({
    'GET_FACILITIES_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const allFacilities = handleActions({
    'GET_ALLFACILITIES_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const memberHouses = handleActions({
    'GET_MEMBERHOUSE_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const bedsDetail = handleActions({
    'GET_BEDSDETAIL_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const auditRecords = handleActions({
    'GET_AUDITRECORDS_SUCCESS' (state, action) {
        return action.payload
    }
},[])