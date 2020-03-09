import Mock from 'mockjs'

Mock.mock('/getArticleList','get',function () {
    return {
        code: 0,
        isSuccess: true,
        data:[
            {id:1,name:"测试name1"},
            {id:2,name:"测试name2"},
            {id:3,name:"测试name3"},
            {id:3,name:"测试name3"}
        ]
    }
})
