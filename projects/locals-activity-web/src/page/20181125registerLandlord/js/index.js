import config from '@js/config.js'
require('../css/index.css')
import {getCode, getAuthCode} from "../../../js/util";
import 'babel-polyfill'

const $$ = Dom7;
const app = new Framework7({
    root: '#app',
});
const imgCode = require('../images/qrcode_publish_zj.jpg')
const imgFooter = require('../images/hbtitle.png')

const Landlord = Landlord || {
    isRepeat: false,
    isRegister: false,
    countdown: 60,
    init: async function () {
        app.views.create('.view-main');
        app.picker.create({
            inputEl: '#demo-picker-device',
            cols: [
                {
                    textAlign: 'center',
                    values: ['北京','广州','成都','重庆','杭州','西安','青岛','厦门','武汉','上海','南京','三亚','桂林','丽江','珠海','长沙','苏州','天津','秦皇岛','大理','昆明','济南','乌鲁木齐','深圳','郑州','合肥','咸宁','无锡','惠州','海口','南昌','宁波','哈尔滨','烟台','大连','太原','石家庄','扬州','贵阳','兰州','西宁','开封','洛阳','福州','南宁','咸宁','拉萨','其他']
                }
            ]
        })
        //获取token
        const res = await getCode(config.api);
        const token = sessionStorage.getItem("token")
        if(res){
            if(!token) {
                app.dialog.alert('请确认微信授权', '', function () {
                    window.location.reload()
                });
            }else{
                //初始化微信分享
                Landlord.getWxConfigParams()
                //初始化事件监听
                Landlord.monitorClickEvent()
            }
        }

    },
    //监听事件
    monitorClickEvent: function() {
        //点击注册
        $$('#register-btn').click(function () {
            Landlord.registerLandlord()
        })
        //发送验证码
        $$('.send-code').click(function () {
            Landlord.getMobileCode()
        })
    },
    getMobileCode: async function() {
        const mobile = $$("input[name='mobile']").val()
        if(!Landlord.validator(mobile,'phone')) {
            return
        }
        if(Landlord.isRepeat) {
            Landlord.msg('正在发送验证码');
            return ;
        }
        try {
            Landlord.isRepeat = true;
            const res = await getAuthCode(config.api,mobile)
            if(res.success) {
                Landlord.isRepeat = false;
                Landlord.msg('发送成功');
                Landlord.setTime();
            }else{
                Landlord.isRepeat = false;
                app.dialog.alert(res.errorMsg, '');
            }
        } catch(err) {
            Landlord.isRepeat = false;
            app.dialog.alert('系统错误', '');
        }
    },
    setTime: function () {
        if (Landlord.countdown === 0) {
            $$('.send-code').html('重新发送')
            Landlord.countdown = 60;
        } else {
            $$('.send-code').html(Landlord.countdown + "s")
            Landlord.countdown--;
            setTimeout(function () {
                Landlord.setTime()
            }, 1000)
        }
    },
    registerLandlord: async function () {
        if(!Landlord.isRegister) {
            Landlord.isRegister = true
            $$('#base-form').css('display','block');
            $$('.page-content').scrollTop(10000, 1000);
        }else {
            try {
                const idCard = $$("input[name='idCard']").val();
                const realName = $$("input[name='realName']").val();
                const mobile = $$("input[name='mobile']").val();
                const code = $$("input[name='code']").val();

                if(!idCard || !realName || !mobile || !code) {
                    app.dialog.alert('请填写完整注册信息', '温馨提醒');
                    return ;
                }
                if(!Landlord.validator(realName,'realname') || !Landlord.validator(idCard,'idCard') || !Landlord.validator(mobile,'phone')) {
                    return ;
                }

                if(Landlord.isRepeat) {
                    Landlord.msg('正在处理，请稍后');
                    return ;
                }
                Landlord.isRepeat = true;
                let params = {
                    idCard: idCard,
                    realName: realName,
                    mobile: mobile
                }

                const token = sessionStorage.getItem("token")
                if(!!token) {
                    $.ajax({
                        type: "PUT",
                        headers: {
                            "LOCALS-ACCESS-TOKEN": "Bearer " + token
                        },
                        url: config.api + '/platform/user/user-landlord-mobile?code=' + code,
                        contentType: "application/json",
                        data: JSON.stringify(params),
                        success: function(res) {
                            if(res.success) {
                                //res.data is landlord token
                                Landlord.getLandlordCode(res.data)
                            }else{
                                app.dialog.alert(res.errorDetail, '');
                            }
                            Landlord.isRepeat = false;
                        },
                        fail: function() {
                            Landlord.isRepeat = false;
                            app.dialog.alert('服务器连接error', '系统错误');
                        }
                    });
                }else{
                    app.dialog.alert('获取Token失败', '');
                    Landlord.isRepeat = false;
                }

            } catch (err) {
                Landlord.isRepeat = false;
                app.dialog.alert('系统错误', '');
                console.log(err)
            }

        }
    },
    getLandlordCode: function(userToken) {
        $.ajax({
            type: "GET",
            headers: {
                "LOCALS-ACCESS-TOKEN": "Bearer " + userToken
            },
            url: config.api + '/platform/user/user-info',
            contentType: "application/json",
            success: function(res) {
                app.popup.create({
                    content:
                    '<div class="popup">'+
                    '<div class="block success-top">'+
                    '<h1>注册成功！</h1>' +
                    '<h1>欢迎您进入路客精品民宿大家庭</h1>' +
                    '<h1>房东编号为：<span style="color: #ff0000;">'+ res.data.memberCode +'</span></h1>' +
                    '</div>' +
                    '<div class="block success-center">' +
                    '<img src="'+ imgCode +'" />' +
                    '<p class="success-dec">- 长按二维码了解更多路客精品民宿 -</p>' +
                    '</div>' +
                    '<div class="block success-footer">' +
                    '<img src="'+ imgFooter +'" />' +
                    '</div>' +
                    '</div>'
                }).open()
            },
            fail: function() {
                app.dialog.alert('服务器连接error', '系统错误');
            }
        });
    },
    //获取微信初始化信息
    getWxConfigParams: function () {
        const url = encodeURIComponent(location.href.split("#")[0].toString());
        $.ajax({
            type: "POST",
            url: config.api + "/wechat/five-plus/config?url=" + url,
            contentType: "application/json",
            success: function(res) {
                Landlord.wxConfigConfiguration(res)
            },
            fail: function() {
                app.dialog.alert('服务器连接error', '系统错误');
            }
        });
    },
    //初始化微信配置
    wxConfigConfiguration: function (respanse) {
        const shareUrl = window.location.href;
        const imgUrl = 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/upload/181128/PAOAZ181128154123543.jpeg'
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: respanse.data.appId,
            timestamp: respanse.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: respanse.data.nonceStr, // 必填，生成签名的随机串
            signature: respanse.data.signature,// 必填，签名
            jsApiList: ['onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone']// 必填，需要使用的JS接口列表
        });
        wx.ready(function () {
            // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareAppMessage({
                title: '有房千万别长租，共享房屋价更高', // 分享标题
                desc: '家中有房，闲置或长租？NO！共享房屋已成为全球深度旅行者的最佳入住选择，加入共享房屋计划，成为全球房东达人，让爱屋焕发生机！', // 分享描述
                link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                // 该链接是重定向链接，因为需要获取用户code，但是该链接又无法直接写微信获取code的链接，
                // 所以需要点击后重新加载新的页面，来实现重定向，重新打开获取code的微信链接，实现获取用户信息的功能；
                imgUrl: imgUrl, // 分享图标
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });

            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline({
                title: '有房千万别长租，共享房屋价更高；加入共享房屋计划，成为全球房东达人。',
                desc: '',
                link: shareUrl,
                imgUrl: imgUrl, // 分享图标
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        })
    },
    validator: function (val, type, normalMessage) {
    const phoneExp = new RegExp(/^1[3-9]\d{9}$/),
        emailExp = new RegExp(
            /^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i
        ),
        passwordExp = new RegExp(/^[\S]{6,16}$/),
        codeExp = new RegExp(/\d{6}/),
        priceExp = new RegExp(/^(-?\d+)(\.\d+)?$/),
        idCardExp = new RegExp(
            /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
        ),
        passportExp = new RegExp(/^[A-Z].[0-9]{7}$/),
        compatriotsExp = new RegExp(/^3\d{7}$/),
        trafficExp = new RegExp(/^[HMhm]{1}([0-9]{10}|[0-9]{8})$/),
        // 只容许2到15位中文名和英文名
        nameRegExp = /^(?:[\u4e00-\u9fa5]{2,15})(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/,
        dateExp = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9]))$/, //时间格式验证，允许2018-08-22格式
        errorMsg = {
            phone: normalMessage || "请填写有效的手机号",
            email: normalMessage || "请填写有效的邮箱",
            password: normalMessage || "请填写6-16位字符，不能包含空格",
            code: normalMessage || "请填写6位数字",
            price: normalMessage || "请输入数字",
            normal: normalMessage || "",
            select: normalMessage || "",
            idCard: "请填写正确的身份证号格式",
            passport: "请填写正确的护照信息",
            compatriots: "请填写正确的台胞证信息",
            traffic: "请填写正确的港澳通行证信息",
            realname: "请输入正确的名字",
            date: normalMessage || "请填写正确日期格式"
        },
        error = [];
        switch (type) {
            case "realname":
                if (!nameRegExp.test(val)) {
                    error.push(errorMsg.realname);
                }
                break;
            case "date":
                if (!dateExp.test(val)) {
                    error.push(errorMsg.date);
                }
                break;
            case "idCard":
                if (!idCardExp.test(val)) {
                    error.push(errorMsg.idCard);
                }
                break;
            case "passport":
                if (!passportExp.test(val)) {
                    error.push(errorMsg.passport);
                }
                break;
            case "compatriots":
                if (!compatriotsExp.test(val)) {
                    error.push(errorMsg.compatriots);
                }
                break;
            case "traffic":
                if (!trafficExp.test(val)) {
                    error.push(errorMsg.traffic);
                }
                break;
            case "phone":
                if (!phoneExp.test(val)) {
                    error.push(errorMsg.phone);
                }
                break;
            case "email":
                if (!!val && !emailExp.test(val)) {
                    error.push(errorMsg.email);
                }
                break;
            case "normal":
                if (!val && val !== 0) {
                    error.push(errorMsg.normal);
                }
                break;
            case "password":
                if (!passwordExp.test(val)) {
                    error.push(errorMsg.password);
                }
                break;
            case "code":
                if (!codeExp.test(val)) {
                    error.push(errorMsg.code);
                }
                break;
            case "price":
                if (!priceExp.test(val)) {
                    error.push(errorMsg.price);
                }
                break;
        }
        console.log(error)
        if (error.length > 0) {
            Landlord.msg(error[0])
            return false;
        }
        return true;
    },
    msg: function (text) {
        app.toast.create({
            text: text,
            position: 'center',
            closeTimeout: 2000,
        }).open();
    }
}
Landlord.init();



