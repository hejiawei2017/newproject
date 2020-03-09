require("@js/flexible.min.js");

import 'babel-polyfill'
import $ from 'jquery'
import '../css/index.less'
import layer from './layer/layer.js'
import './layer/theme/default/layer.css'
import {
    getCode
} from "../../../js/util"
import Config from "@js/config.js"
let img = null
// 预加载图片
function preLoad(img) {
    let imageElement = new Image()
    imageElement.src = img
    imageElement.style.display = 'none'
    document.body.append(imageElement)
}

if (MY_ENV === 'dev') {
    img = require('../images/dev-qrcode.jpeg')
} else {
    img = require('../images/showqrcode.jpeg')
}

preLoad(img)

let roomNumberId = getUrlParam("roomNumberId")
let guestlist = JSON.parse(localStorage.getItem("guest"));
let starttime;
let endtime;
let bookingId;
let api = Config.api;
let imgHead = Config.imgHead;
let flag = true
$(function(){
    let sid = getUrlParam("sid")
    

    let loadindex = layer.load(3, {
        shade: [0.3,'#000'] //0.1透明度的白色背景
    });
    async function getUserInfo() {
        let result = null
        try {
            result = await getCode();
        } catch(e) {
            layer.msg(`授权登录失败，请刷新页面重新授权\n[${e.traceid}]`)
        }
        
        if (!result) {
            console.log('获取token失败')
            return 
        } else {
            // 等待获取token
            if (sessionStorage.getItem("token")) {
                $.ajax({
                    type: "GET",
                    headers: {
                        "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token")
                    },
                    url: api + "/platform/user/user-info",
                    success: function (res) {
                        sessionStorage.setItem("userInfo", JSON.stringify(res.data));
                        localStorage.setItem('userInfo',JSON.stringify(res.data))
                        $.ajax({
                            url: api+'/booking-plus/encry/order/'+sid+'/detial',
                            methods:'GET',
                            success:function(res){
                                if(res.success){
                                    $(".nomore").hide();
                                    $(".more").show();
                                    starttime = res.data.checkinDate;
                                    endtime = res.data.checkoutDate;
                                    bookingId = res.data.bookingId;
                                    $("#test1").html(starttime)
                                    $("#test2").html(endtime)
                                    $("#viewtest1").html(getWeek(starttime))
                                    $("#viewtest2").html(getWeek(endtime))
                                    $(".weui-flex__2 img").attr("src",processImage(res.data.showImg));
                                    $(".weui-flex__3 .omit").text(res.data.title);
                                    $(".weui-flex__3 .des").text(res.data.roomNumber + "间卧室·" + res.data.toiletNumber + "个卫生间·"+ res.data.bedNumber +"张床");
                                    let start = new Date().getTime();
                                    let end = new Date(endtime +" "+ "12:00:00").getTime();
                                    if(false&&start>end){
                                        layer.msg("您已超过可填写时间")
                                    }
                                }else{
                                    $(".nomore p").html("请求失败，请重试");
                                    $(".nomore").show();
                                    $(".more").hide();
                                    layer.msg("请求失败，请重试~")
                                    layer.close(loadindex)
                                }
                                setTimeout(function(){
                                    layer.close(loadindex)
                                },800)
                            },
                            error:function(result){
                                $(".nomore p").html("请求失败，请重试");
                                $(".nomore").show();
                                $(".more").hide();
                                layer.msg("请求失败，请重试~")
                                layer.close(loadindex)
                            }
                        })
                        if(guestlist){
                            var html = '' ;
                            for(var i=0;i<guestlist.length;i++){
                                html += '<div class="item"><div class="remove">-</div>';
                                html += ' <span class="center index">' + guestlist[i].name + '</span>';
                                html += '<span class="center name">' + guestlist[i].mobileTelephone + '</span>';
                                html += '<span class="center cardNo">' + guestlist[i].certificateNo + '</span></div>'
                            }
                            $(".guestlist").prepend(html)
                            delect()
                        }
                        jump()
                        detail()
                        orderConfirm()
                    }
                });
            }else{
                layer.close(loadindex)
                sessionStorage.removeItem('token');
                layer.msg("授权登录失败，请刷新页面重新授权")
            } 
        } 
    }
    getUserInfo();
})

function jump(){
    let list = JSON.parse(localStorage.getItem("guest"));
    $("#jump").on("click",function(){
        let start = new Date().getTime();
        let end = new Date(endtime +" "+ "12:00:00").getTime();
        if(false&&start>end){
            layer.msg("您已超过可填写时间")
        }else{
            if(list){
                if(list.length>0){
                    layer.msg("每次只可填写一位投保人")
                }else{
                    window.location.href= "./guestadd.html"
                }
            }else{
                window.location.href= "./guestadd.html"
            }
        }
    })
}

function delect(){
    $(".guestlist .item").each(function(){
        let that = $(this);
        let index = $(this).index()
        $(that).find(".remove").on("click",function(){
            var carNo = $(that).find(".cardNo").html();
            if(guestlist){
                for(var i=0;i<guestlist.length;i++){
                    if(guestlist[i].certificateNo == carNo){
                        guestlist.splice(i, 1); 
                    }
                }
            }
            localStorage.setItem("guest",JSON.stringify(guestlist));
            $(that).remove();
            guestlist = JSON.parse(localStorage.getItem("guest"));
            jump()
        })
    })
    
}
function detail(){
    $("#detail").click(function(){
        layer.open({
            type:1,
            title:'保险详情',
            content:'<div class="lay">Locals路客与平安保险公司合作推出“住宿路客意外伤害保险”，保障您在住宿期间的人身安全。保险将在入住时生效，保障时长为您在线预订的入驻天数。为您的出行人身安全保驾护航，请准确填写入住人信息确保权益兑现。如果您遇到保险的任何相关问题，请拔打平安保险全国统一服务热线95511。</div>',
            area:'80%',
            offset: '20%',
            skin:'layer-normal-css',
            closeBtn:false,
            btn: '我知道了'
        })
    })
}
function orderConfirm(){
    $("#orderConfirm").on("click",function(){
        if(flag == true){
            let start = new Date().getTime();
            let end = new Date(endtime +" "+ "12:00:00").getTime();
            if(false && start>end){
                layer.msg("您已超过可填写时间")
            }else{
                if($(".guestlist .item").length == 0){
                    layer.msg('请添加入住人')
                    return false;  
                }else if(!($(".checkbox").is(":checked"))){
                    layer.msg('请阅读服务协议和保险书')
                    return false;  
                }else{
                    var person = ''
                    if(guestlist){
                        for(var i=0;i<guestlist.length;i++){
                            if(i == guestlist.length-1){
                                person += guestlist[i].name 
                            }else{
                                person += guestlist[i].name + '、'
                            }
                        }
                    }
                    layer.confirm('投保人信息已添加，请点击[确定]提交',
                        {
                           title:'确定',
                           area:'80%',
                           skin:'layer-sure-css'
                        }, 
                        function(index){
                            if(!bookingId){
                                layer.msg("订单错误，请刷新页面~")
                            }else{
                                let userInfo = JSON.parse(localStorage.getItem("userInfo"));
                                let openId = sessionStorage.getItem('openId') || userInfo.appOpenId || userInfo.openId
                                starttime = starttime +" "+ "14:00:00";
                                endtime = endtime +" "+ "12:00:00";
                                let guest = JSON.parse(localStorage.getItem("guest"));
                                let list = {
                                    "riskPersonInfoList":guest
                                }
                                let riskGroupInfoList = []
                                riskGroupInfoList.push(list)
                                let baseInfo = {
                                    "insuranceBeginDate":starttime,
                                    "insuranceEndDate":endtime,
                                    "transactionNo":bookingId
                                }
                                let params = {
                                    "baseInfo":baseInfo,
                                    "riskGroupInfoList":riskGroupInfoList
                                }
                                let productInfoList = []
                                productInfoList.push(params)
                                let data = {
                                    openId,
                                    roomNumberId,
                                    "applyPolicyNoPayParam": JSON.stringify({
                                        productInfoList
                                    })
                                }
                                data = JSON.stringify(data)
                                // 修改为保存入住人信息，返回openid
                                $.ajax({
                                    url: `${api}/booking-plus/checkin/pa/save-activate-info`,
                                    type:'POST',
                                    contentType: "application/json",
                                    data,
                                    success:function(res){
                                        if(res.success){           
                                            layerSuccess()
                                        }else{
                                            layer.msg(res.errorDetail)
                                            if ($.trim(res.errorDetail) === '保单信息已存在，请勿重复提交') {
                                                layerSuccess()
                                            }
                                        }
                                    }
                                })
                                layer.close(index);
                            }
                        }); 
                }
            }
        }else{
            layer.msg("请勿重复提交")
        }
    })
}

function layerSuccess() {
    layer.open({
        type:1,
        title:'投保成功',
        content:'<div class="lay"><p>订单提交成功，还差一步就能获得保单</p><p class="red">必须本人长按二维码激活保单</p><img src="'+img+'"/></div></div>',
        area:'80%',
        offset: '20%',
        skin:'layer-normal-css',
        closeBtn:false
    })
    localStorage.removeItem("guest")
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function getWeek(data){
    data = new Date(data).getDay()
    let day;
    switch (data) {
        case 0: day = "周日"; break;
        case 1: day = "周一"; break;
        case 2: day = "周二"; break;
        case 3: day = "周三"; break;
        case 4: day = "周四"; break;
        case 5: day = "周五"; break;
        case 6: day = "周六"; break;
        default: day = null;
    }
    return day
}

function processImage(imgPath) {//参考别人的图片路径处理
    if (imgPath) {
      // 修正window的路径的正斜杠
      imgPath = imgPath.replace("/\\/g", "\/")
  
      // http图片路径直接返回不用处理
      if (imgPath.indexOf('http') != -1) {
        return encodeURI(imgPath)
      }
      // 处理cdn路径
      if (imgPath.indexOf('/UploadFiles/') != -1) {
        return encodeURI("http://app.localhome.cn" + imgPath)
      }
      // 处理cdn路径
      if (imgPath.indexOf('/upload/') != -1) {
        return encodeURI("http://app.localhome.cn" + imgPath)
      }
      // 如果file开头,本地文件,跳过处理
      if (imgPath.indexOf('file') != -1) {
        return imgPath
      }
      // 签名图
      if (imgPath.indexOf('/temp/') != -1) {
        var newPath = encodeURI("http://qy.localhome.com.cn/locals" + imgPath)
        return newPath
      }
      // 新服务图片URL
      return encodeURI(imgHead + imgPath)
    }
    return ''
}