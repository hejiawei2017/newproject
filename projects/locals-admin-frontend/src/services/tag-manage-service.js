import Ajax from '../utils/axios.js'

export default {
    addCustomerTag: (data) => {//新增房源标签
        return Ajax.post('/prod-plus/customer/tag', data)
    },
    updateCustomerTag: (data) => {//编辑房源标签
        return Ajax.put(`/prod-plus/customer/tag`, data)
    },
    getCustomerTag: (data) => {//房源标签列表
        return Ajax.get('/prod-plus/customer/tag', data)
    },
    getTagCategory: (data) => {//标签分类
        return Ajax.get('/prod-plus/custom/tag/category/list', data)
    },
    deleteCustomerTag: (data) => {//批量删除房源关联标签
        return Ajax.delete('/houses/custom/tag/map/batch-delete', data)
    },
    customerTagMap: (data) => {//房源标签显示
        return Ajax.get('/prod-plus/house/custom/tag/map', data)
    },
    saveCustomerTagMap: (data) => {//设置房源标签
        return Ajax.post('/prod-plus/house/custom/tag/map/save', data)
    }
}
