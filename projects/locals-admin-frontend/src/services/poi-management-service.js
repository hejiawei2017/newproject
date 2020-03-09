
import Ajax from '../utils/axios.js'

export default {
    getCityTable: (data)=>{// 区域城市列表
        return Ajax.get('/prod-plus/poi/districts', data)
    },
    putCityTable: (data)=>{// 修改区域城市信息，只可以修改排名
        return Ajax.put('/prod-plus/poi/district',data)
    },
    getCategory: (data)=>{// 类别列表
        return Ajax.get('/prod-plus/poi/config/tag-categories', data)
    },
    postCategory: (data)=>{//新增类别
        return Ajax.post('/prod-plus/poi/config/tag-category',data)
    },
    putCategory: (data)=>{//更新修改类别
        return Ajax.put('/prod-plus/poi/config/tag-category',data)
    },
    postCustCategory: (data)=>{ //新增自定义类别
        return Ajax.post('/prod-plus/poi/tag-category', data)
    },
    getLabelTabel: (data)=>{
        return Ajax.get('/prod-plus/page/pois', data)
    },
    // getLabelTabel: (data)=>{//标签列表
    //     return Ajax.get('/prod-plus/poi/tags', data)
    // },
    putLabelTalel: (data) =>{ //修改标签
        return Ajax.put('/prod-plus/poi/tag',data)
    },
    postLabel: (data) =>{ //新增标签
        return Ajax.post('/prod-plus/poi/tag' ,data)
    },
    putPoi: (data)=>{
        return Ajax.put('/prod-plus/poi', data)
    },
    postPoi: (data)=>{
        return Ajax.post('/prod-plus/poi', data)
    },
    getHot: (cityName)=>{ //通过城市名称获取热门分类
        return Ajax.get(`/prod-plus/pois/city-name/${cityName}`)
    },
    postHot: (id)=>{//同步热门，即设置为热门
        return Ajax.put(`/prod-plus/poi/hot/${id}`)
    }
}