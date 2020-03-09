import Ajax from '../utils/axios.js'

export default {
    sendCode: (data) =>{
        return Ajax.post('/platform/auth/auth-code/send',data) // 发送验证码
    },
    signInCode: (data) =>{
        return Ajax.post('/platform/auth/auth-code/sign-in', {...data, 'platform':'ADMIN'}) // 验证码登录
    },
    platformAuth: (data) =>{
        return Ajax.post('/platform/auth',{...data, 'platform':'ADMIN'}) // 密码登录
    },
    forgetPassword: (data) =>{
        return Ajax.put('/platform/user/user-info-password',data) // 修改密码
    }
}