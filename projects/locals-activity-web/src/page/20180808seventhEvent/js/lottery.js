import $ from 'jquery'
import Config from '@js/config.js'
import '../css/lottery.less'
import '../css/active-end.less'
const img1 = require('../images/04.png')
const img2 = require('../images/01.png')
const img3 = require('../images/02.png')
let api=Config.api;
// let api="http://ms.localhome.cn/api";

var flag=false;

$('.goAward-btn').click(function(){
    location.href='./products.html'
})

$(".start-btn").click(function () {
    $('start-btn').attr('disabled',true)
    // console.log(222)
    let phoneNumber=sessionStorage.getItem('phoneNumber')
    if(!flag){
        flag=true;
        let award;
        reset();
        // 请求数据
        $.ajax({
            type: 'GET',
            url:`http://120.78.15.214:6064/prizepool?phoneNumber=${phoneNumber}`,
            // data:JSON.stringify({phoneNumber:phoneNumber}),
            success:function(res){
                if(res.success){
                    // console.log(333)
                    if(res.code){
                        $('start-btn').removeAttr('disabled')
                        let award;
                        award=res.code;
                        requestAward(award)
                    }else{
                        alert('您已经抽过奖啦！')
                    }
                }
            },
            error:function(err){
                alert("出错啦,请重试一下")
            }
        })
        // 开始抽奖
        // requestAward(1)
        
        // setTimeout(function () {
        //     flag=false;
        //     if(index==2){
        //         $(".fix,.pop-form").show();
        //     }else{
        //         $(".fix,.pop").show();
        //         //$(".pop-text span").text(""+String(4-TextNum1)+(8-TextNum2))
        //     }
        // },2000);
        // index++;
    }else{
        $('.dialog').css("display",'flex');
    }
});
$('.close').click(function(){
    $('.dialog').css("display",'none');
})

function requestAward(code){
    let top="-400%"
    if(code==1){
        top="-700%";
        $('.awardImg>img').attr('src',img1)
    }else if(code==2){
        top="-100%";
        $('.awardImg>img').attr('src',img2)
    }else if(code==3){
        top="-600%";
        $('.awardImg>img').attr('src',img3)
    }else{
        top="-600%"
    }
    // 提升会员等级
    memberCard()
    // 开始抽奖
    letGo(top)
}

function letGo(top){
    $(".roll").animate({"top":'-1200%'},1000,"linear", function () {
        $(this).css("top",0).animate({"top":top},1300,"linear",function(){
            setTimeout(() => {
                $('.dialog').css("display",'flex');
            }, 1000);
        });
        
    });
}
function reset(){
    $(".roll").css({"top":'-200%'});
}

// 会员等级提升请求方法
function memberCard(){
    let id=JSON.parse(localStorage.getItem('userInfo')).id;
    let memberCardCode="SILVER";
    let validTimeStart=new Date().getTime();
    let now=new Date();
    let end=now.setFullYear(now.getFullYear() + 1)
    let validTimeEnd=now.getTime();

    let params={
        "userId":id,
        "memberCardCode":memberCardCode,
        "validTimeStart":validTimeStart,
        "validTimeEnd":validTimeEnd
    }

    $.ajax({
        type:"PUT",
        url:api+'/platform/member',
        data:JSON.stringify(params),  
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        success:function(res){
        },
        error:function(err){
            console.log(err)
        }
    })
}