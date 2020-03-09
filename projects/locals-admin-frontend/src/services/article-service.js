import Ajax from '../utils/axios.js'

export default {
    getArticlesTable: (data)=>{
        // 获取图文列表
        return Ajax.get('/act/articles', data)
    },
    deleteArticles: (data)=>{
        // 删除图文
        return Ajax.delete(`/act/article/${data}`)
    },
    getArticlesLabelTable: (data)=>{
        // 获取标签列表
        return Ajax.get('/act/article-tags', data)
    },
    deleteArticlesLabel: (data)=>{
        // 删除图文
        return Ajax.delete(`/act/article-tag/${data}`)
    },
    addArticlesLabel: (data)=>{
        // 增加标签
        return Ajax.post('/act/article-tag', data)
    },
    modifyArticlesLabel: (data)=>{
        // 修改标签
        return Ajax.put('/act/article-tag', data)
    },
    addArticle: (data)=>{
        // 增加图文
        return Ajax.post('/act/article', data)
    },
    putArticle: (data)=>{
        // 增加图文
        return Ajax.put('/act/article', data)
    },
    getArticleInfo: (data)=>{
        // 获取图文详情
        return Ajax.get(`/act/article/${data}`)
    },
    attachmentByte: (data,id)=>{
        // 上传图片
        const formData = new FormData()
        formData.append('file', data)
        return Ajax.uploadPost(`/atta/attachment-byte/model/${id}/name/article`, formData)
    }
}