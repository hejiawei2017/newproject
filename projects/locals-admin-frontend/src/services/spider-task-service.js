import Ajax from '../utils/axios.js'

export default {
    getDeployTable: (data) => {
        return Ajax.get('http://uat.localhome.cn/api/spider/deploy/list', data)
    },
    updateDeployInfo: (data) => {
        return Ajax.put(`http://uat.localhome.cn/api/spider/deploy/update`, data)
    },
    createDeployInfo: (data) => {
        return Ajax.post('http://uat.localhome.cn/api/spider/deploy/create', data)
    },
    updateDeployStatus: (data) => {
        return Ajax.put('http://uat.localhome.cn/api/spider/deploy/update/status', data)
    },
    deleteDeployInfo: (data) => {
        return Ajax.delete(`http://uat.localhome.cn/api/spider/deploy/delete`, data)
    },
    getDeployById: (deployId) => {
        return Ajax.get(`http://127.0.0.1:7001/api/spider/deploy/${deployId}`)
    }

}
