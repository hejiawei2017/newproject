import Ajax from '../../utils/axios.js'




// import Mock from 'mockjs'
// Mock.mock('/api/wechat/tags','get',function () {
//     return {
//         code: 0,
//         isSuccess: true,
//         data:[
//             {id:1,name:"测试name1",tagId:"111",count:"234",type:"微信1",userExit:""},
//             {id:2,name:"测试name2",tagId:"22",count:"234",type:"微信2",userExit:""},
//             {id:3,name:"测试name3",tagId:"33",count:"234",type:"微信3",userExit:""},
//             {id:4,name:"测试name4",tagId:"44",count:"234",type:"微信4",userExit:""},
//         ]
//     }
// })


export default {
    getUserlabelList: (data) => {//用户标签列表
        return Ajax.get('/wechat/tags', data)
    },
    getUserByLabel: (id,tagId) => {//获取某个标签下所有用户
        return Ajax.get(`/wechat/tags/users/${id}/${tagId}`)
    },
    deleteLabelById: (id) => {//删除标签
        return Ajax.DELETE(`/wechat/tag/!{id}`)
    },
    addUser: (data) => {//批量新增用户标签
        return Ajax.post('/wechat/tag/user', data)
    }
}


