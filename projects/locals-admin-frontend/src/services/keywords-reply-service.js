import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/wechat/keywords', data)
    },
    addKeyword: (data) =>{
        return Ajax.post('/wechat/keyword', data)
    },
    getReplys: ()=>{
        let data = {
            pageNum: 1,
            pageSize: 1000
        }
        return Ajax.get('/wechat/replys', data)
    }
}