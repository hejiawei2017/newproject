import Ajax from '../utils/axios.js'

export default {
    getTable: (data) => {
        // 房源合同列表
        return Ajax.post('/old/house-source-contract-list', data)
    },
    getItem: (id) => {
        // 房源合同详情查询
        return Ajax.get(`/old/house-source-contract/${id}`)
    },
    contractUpdate: (data) => {
        // 房源合同修改
        return Ajax.post('/old/house-source-contract-update', data)
    },
    setName: (data) => {
        // 批量修改合同签约姓名
        return Ajax.post('/old/sign-name-batch-update', data)
    },
    getAttachment: (id) => {
        // 房源合同附件查看
        return Ajax.get(`/old/house-source-contract-attachment/${id}`)
    },
    getLogs: (modelId) => {
        // 房源合同操作日志查看
        return Ajax.get(`/old/house-contract-log/${modelId}`)
    }
}