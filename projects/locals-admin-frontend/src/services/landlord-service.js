import Ajax from '../utils/axios.js'

export default {
    getSatisfaction: (data)=>{
        // 获取列表
        return Ajax.get('/act/landlord-exam-info/page', data)
    },
    getExamConfig: (data)=>{
        // 获取问卷配置信息
        return Ajax.get('/act/landlord-exam-info/config/exam-id', data)
    },
    setExamConfig: (data)=>{
        // 设置问卷配置信息
        return Ajax.post('/act/landlord-exam-info/config', data)
    },
    getExamAnswer: (data)=>{
        // 根据答卷ID获取所有版本答案信息
        return Ajax.get('/act/exam-item-answer/biz/exam-answer-id', data)
    }
}
