import Ajax from '../utils/axios.js'
export default {
    getTable: (data) =>{
        return Ajax.get('/platform/employee-biz',data) // 获取table列表
    },
    getTableJobStatus: (data) =>{
        return Ajax.get('/platform/employees',data) // 获取新入职table列表
    },
    getMoveTable: (data) =>{
        return Ajax.get('/platform/employee-biz/move',data) // 获取异动table列表
    },
    getModifyRecordsTable: (data) =>{
        return Ajax.get('/platform/employee-biz/modify-records',data) // 获取异动table列表
    },
    activeEmployee: (employeeId) =>{
        return Ajax.post('/platform/employee-biz/active?employeeId=' + employeeId) // 激活
    },
    putEmployee: (data) =>{
        return Ajax.put('/platform/employee-biz',data) // 修改
    },
    putEmployeeBizMove: (data) =>{
        return Ajax.post('/platform/employee-biz/move',data) // 异动
    },
    deletePosition: (data) =>{
        return Ajax.delete('/platform/position',data) // 获取table列表
    },
    getSiteTable: (data) => {
        return Ajax.get('/base/china-areas', data)
    }
}
