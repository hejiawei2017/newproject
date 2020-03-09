import Ajax from '../utils/axios.js'
export default {
    getUserInfo: (data) =>{
        return Ajax.get('/platform/user/user-info', data) // 获取用户信息
    },
    getUserRole: (data) =>{
        return Ajax.get(`/platform/role-authorities/user-id?userId=${data}`) // 获取用户权限
    },
    putMember: data => {
        return Ajax.put('/platform/member',data) // 升级会员
    }
}