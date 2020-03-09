import Ajax from '../utils/axios.js'
export default {
    getCommentTable: (data) =>{
        return Ajax.get('/prod-plus/comments',data) // 获取table列表
    },
    commentDel: (data) =>{
        return Ajax.delete(`/prod-plus/comment/${data}`,true) // 删除评论
    },
    commentOnly: (data) =>{
        return Ajax.get(`/prod-plus/comment/${data}`,true) // 获取单条评论信息
    },
    updateComment: (data) =>{
        return Ajax.put('/prod-plus/comment',data,true) // 更新评论
    },
    addComment: (data) =>{
        return Ajax.post('/prod-plus/comment',data) // 增加评论
    }

}