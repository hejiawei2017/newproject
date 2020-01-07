let JMessage = require('../libs/jmessage-wxapplet-sdk-1.4.0.min.js');
import IMserver from "../server/im"
let App = getApp();
let jim = App.jim;
let thatData = {
    LoginInfo: {}
}
let imTabbarIndex = 1
let localsIm = {
    isInit(){
        return jim && jim.isInit()
    },
    isLogin() {
        return jim && jim.isLogin()
    },
    init(){
        // 初始化
        return new Promise((resolve, reject) => {
            if(jim && jim.isInit()){
                resolve()
            }else if(App.globalData.userInfo.id && App.globalData.userInfo.mobile){
                if(!jim){
                    jim = new JMessage({
                        debug: false
                    });
                    App.jim = jim
                }
                IMserver.getImInitInfo()
                    .then((data) => {
                        let { appKey, randomStr, signature, timestamp } = data.data
                        jim.init({
                            "appkey": appKey,
                            "random_str": randomStr,
                            "signature": signature,
                            "timestamp": timestamp,
                            "flag": 1
                        }).onSuccess((data) => {
                            resolve()
                        }).onFail((data) => {
                            console.log('init onFail', data)
                            reject(data)
                        });
                    });
            }
        });
    },
    login () {
        // 登录
        let userId = App.globalData.userInfo.id     
        let self = this
        return new Promise((resolve, reject) => {
            if(jim && jim.isLogin()){
                resolve(thatData.LoginInfo)
            }else{
                IMserver.getLoginInfo(userId)
                    .then((data)=>{
                        let {username, password} = data.data
                        jim.login({
                            username,
                            password
                        }).onSuccess((res) => {
                            thatData.LoginInfo = {data: data.data, imRes:res}
                            resolve(thatData.LoginInfo)
                        }).onFail((data) => {
                            console.log('onLoginFail', data)
                            reject(data)
                            if (data.message === "user not exist"){
                                // this.imRegister(user, pass, this.imLogin)
                            }
                        });
                    })
            }
        })
    },
    sendGroupMsg(groupId, messages, extras){
        // 发送消息
        return jim.sendGroupMsg({
            'target_gid' : groupId,
            'content' : messages,
            extras,
            custom_notification: {
                enabled: true,
                title: extras.houseSourceTitle,
                alert: extras.bookingUserName + '说:' + messages
            }
        })
    },
    onMsgReceive (callFn){
        // 监听消息
        jim.onMsgReceive(function(data){
            callFn && callFn(data)
        })
    },
    getMessageTotalUnread(){
        return IMserver.getMessageTotalUnread().then((e)=>{
            if(e.success && e.data > 0){
                App.globalData.unreadNum = Number(e.data)
                wx.setTabBarBadge({index:imTabbarIndex,text: App.globalData.unreadNum.toString()})
                return e
            }else if(e.success && e.data == 0){
                wx.removeTabBarBadge({
                    index: imTabbarIndex
                })
            }
        })
    },
    // 断线监听
    onDisconnect() {
        jim.onDisconnect(() => {
            wx.showToast({
                icon: 'none',
                title: '聊天用户已断线'
            })
        })
    }
}
module.exports = localsIm