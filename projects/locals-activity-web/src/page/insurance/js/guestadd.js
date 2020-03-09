require("@js/flexible.min.js");
import 'babel-polyfill'
import $ from 'jquery'
import '../css/guestadd.less'
import layer from './layer/layer.js'
import './layer/theme/default/layer.css'
import Config from "@js/config.js"
import { validator } from '@js/util.js'

let api = Config.api;
$(".radio div").hide();
$(".radio div.icd").show();

$('input:radio[name="way"]').change(function(){
    if($(this).is(":checked")){
        if($(this).val() === 'Idcard'){
            $(this).parents(".radio").find("div").show().parents(".radio").siblings().find("div").hide()
            $(".overhead").hide()
        }else if($(this).val() === 'hmtIdcard'){
            $(this).parents(".radio").find("div").show().parents(".radio").siblings().find("div").hide()
            $(".overhead").show()
        }else if($(this).val() === 'hkIdcard'){
            $(this).parents(".radio").find("div").show().parents(".radio").siblings().find("div").hide()
            $(".overhead").show()
        }else{
            $(this).parents(".radio").find("div").show().parents(".radio").siblings().find("div").hide()
            $(".overhead").show()
        }
     }
})

function code(name, type, cerno, age, birth, sex, number, way) {
    var guestlist = JSON.parse(localStorage.getItem("guest"));
    var number = $(".number").val();
    $(".codenum").val(number)
    // 身份证以外不走手机验证流程
    if (way === 'Idcard') {
        layer.open({
            type:1,
            title:'手机验证',
            content:$('#verific'),
            area:'80%',
            skin:'layer-normal-css',
            offset: '18%',
            closeBtn:false,
            btn: ['确定','取消'],
            shadeClose: true,
            yes: function(index, layero){
                var code = $(".code").val();
                if(!validator(code,'normal','请输入验证码')){
                    return false
                }else{
                    let params = {
                        "account": number.toString(),
                        "authCode":code.toString()
                    }
                    $.ajax({
                        url:api+'/platform/validation/check-mobile',
                        type: 'put',
                        contentType: "application/json",
                        data: JSON.stringify(params),
                        success: function (res) {
                            if(res.success == true){
                                layer.close(index); //如果设定了yes回调，需进行手工关闭

                                let params = {
                                    "name": name,
                                    "certificateType":type,
                                    "certificateNo": cerno,
                                    "mobileTelephone": number
                                }
                                
                                setGuestToLocalstorage(guestlist, params, cerno)
                            }else{
                                layer.msg("验证码错误")
                            }
                        }
                    })
                }
                
            }
        })
    } else {
        let params = {
            "name": name,
            "certificateType":type,
            "certificateNo": cerno,
            "age": age,
            "birthday": birth,
            "sexCode": sex,
            "mobileTelephone": number
        }

        setGuestToLocalstorage(guestlist, params, cerno)
    }
}

function setGuestToLocalstorage(guestlist, params, cerno) {
    if (guestlist) {
        for(var i = 0; i < guestlist.length; i++) {
            if(guestlist[i].carNo == cerno){
                 guestlist.splice(i,1)
            }
        }
        guestlist.unshift(params)
        localStorage.setItem("guest",JSON.stringify(guestlist));
    }else{
        var array = [];
        array.unshift(params);
        localStorage.setItem("guest",JSON.stringify(array));
    }
    window.history.back();
}

let isHasSending = false
$(".get-code").on("click",function(){
    var number = $(".number").val();
    var time = 60;
    var item;
    clearInterval(item)
    if (isHasSending) {
        layer.msg("短信已发送，请稍等~")
        return false
    }
    if(number){
        item = setInterval(function(){
            $(".get-code").html(time+"秒后获取")
            if(time === 0){
                $(".get-code").html("获取验证码")
                isHasSending = false
                clearInterval(item)
            }else{
                time--;
            }
        },1000)
        if(time === 0 || time === 60){
            var params = {
                "account": number.toString()
            }
            $.ajax({
                url:api+'/platform/validation/sent-mobile',
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify(params),
                success:function(res){
                    isHasSending = true
                    layer.msg("验证码已发送！")
                }
            })
        }else{
            layer.msg("请填写手机号码")
        }
    }
})
$(".btn").on("click",function(){
    let name = $.trim($(".name").val());
    let icd = $.trim($(".icd input").val());
    icd = ''+icd.toUpperCase();
    let gatb = $.trim($(".gatb input").val());
    let pspt = $.trim($(".pspt input").val());
    let gap = $.trim($(".gap input").val());
    let age = $.trim($(".age").val());
    let number = $.trim($(".number").val());
    let sex = $('input:radio[name="sex"]:checked').val();
    let way = $('input:radio[name="way"]:checked').val();
    let birth = $.trim($(".birth").val());
    let date= new Date(Date.parse(birth.replace(/-/g,  "/")));
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? `0${month}` : month
    let day = date.getDate()
    day = day < 10 ? `0${day}` : day
    birth = `${year}-${month}-${day}`

    if(way === 'Idcard'){
        if(!validator(name, 'realname')){
            return false
        }else if(!validator(icd,'idCard')){
            return false
        }else if(!validator(number,'phone')){
            return false
        }else{
            code(name, '01', icd, age, birth, sex, number, way)
        }
    }else if(way === 'hmtIdcard'){
        if(!validator(name, 'realname')){
            return false
        }else if(!gatb || (gatb && gatb.length < 6)){
            layer.msg("请输入正确证件")
            return false
        }else if(!age || age < 0 || age > 75){
            layer.msg("请输入正确的年龄段 0 ~ 75 岁")
            return false
        }else if(!validator(birth,'date')){
            return false
        }else if(!validator(sex,'normal','请输入选择性别')){
            return false
        }else if(!number || number.length < 8){
            layer.msg('请填入正确的手机号')
            return false
        }else{
            code(name, '06', gatb, age, birth, sex, number, way)
        }
    }else if(way === 'hkIdcard'){
        if(!validator(name, 'realname')) {
            return false
        }else if(!gap || (gap && gap.length < 6)){
            layer.msg("请输入正确证件")
            return false
        }else if (!age || age < 0 || age > 75) {
            layer.msg("请输入正确的年龄段 0 ~ 75 岁")
            return false
        }else if(!validator(birth,'date')){
            return false
        }else if(!validator(sex,'normal','请输入选择性别')){
            return false
        }else if(!number || number.length < 8){
            layer.msg('请填入正确的手机号')
            return false
        }else{
            code(name, '04', gap, age, birth, sex, number, way)
        }
    }else if(way === 'Passport'){
        if(!validator(name, 'realname')){
            return false
        }else if (!pspt || (pspt && pspt.length < 6)) {
            layer.msg("请输入正确passport")
            return false
        }else if (!age || age < 0 || age > 75) {
            layer.msg("请输入正确的年龄段 0 ~ 75 岁")
            return false
        }else if(!validator(birth,'date')){
            return false
        }else if(!validator(sex,'normal','请输入选择性别')){
            return false
        }else if(!number || number.length < 8){
            layer.msg('请填入正确的手机号')
            return false
        }else{
            code(name, '02', pspt, age, birth, sex, number, way)
        }
    }else{
        layer.msg("请填写证件号")
    }
})

