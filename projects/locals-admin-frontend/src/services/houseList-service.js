import Ajax from '../utils/axios.js'
export default {
    getTable: (data) =>{
        return Ajax.get('/prod-plus/house/manage',data) // 获取table列表
    },
    houseEdit: (data) =>{
        return Ajax.put('/prod-plus/house/order-by-app',data) // 修改排名
    },
    houseImage: (data) =>{
        return Ajax.get(`/prod-plus/house/${data}/images`,"",true) // 获取图片数据
    },
    houseDetail: (id) =>{
        return Ajax.get(`/prod-plus/backstage/house/${id}/detail`,"",true) // 获取详情数据
    },
    houseDesiger: (data) =>{
        return Ajax.get('/prod/house-facility/house-source-id',data,true) // 获取遍历数据
    },
    rentChange: (data,type) =>{
        return Ajax.put(`/prod-plus/house/${data}/rentType?rentType=${type}`) //修改长短租
    }
}
