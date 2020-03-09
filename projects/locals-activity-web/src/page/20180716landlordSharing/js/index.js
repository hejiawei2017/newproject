import 'babel-polyfill'
import '../css/reset.css'
import '@js/flexible.min.js'
import '../css/index.less'
import './jquery.qrcode.min'
import '../css/loading.less'
(function (){
    let landlordObj = {
        dataList: {},
        total: null,
        url:'http://ms.localhome.cn/api/v2',
        api:{
            getUserInfo: '/prod/old/landlord/'
        },
        getUserInfo: function (){
            if(!this.getQueryString('userId'))return false;
            $.ajax({
                type: "GET",
                url: this.url + this.api.getUserInfo + this.getQueryString('userId'),
                data:{},
                dataType: 'json',
                success: (e)=>{
                    console.log('get', e)
                    let data = e.data;
                    if(data){
                        $(".user .userName").text(data.nickName)
                        $("img.avatar").attr("src","http://app.localhome.cn/"+data.avatar)
                        $(".landlord-data .dayTxt").text(data.activeDay)
                        $(".peopleNum-wrap .peopleNum").text(data.serviceCount)
                        this.generateQRCode("canvas", 100, 100, location.href.split("/index.html")[0] + "/housingList.html?userId=" + data.userId );
                        $(".spinner").hide();
                        $(".landlord-page").show();
                        // + this.getQueryString('userId'));
                    }
                }
            })
        },
        loadMore: function (pullfresh) {
            // console.log('pullfresh')
            if(this.total > 0 && this.total/this.pageSize > this.pageNum ){
                pullfresh.endPullupToRefresh(false);
                this.pageNum ++
                this.getUserInfo()
            }else{
                pullfresh.endPullupToRefresh(true);
            }
        },
        getQueryString: function (name){
            if(name.match(/\[|\]|\-/) !=null && name.match(/\[|\]|\-/).length >0)name=name.replace(/\[/g,'\\[').replace(/\]/g,'\\]').replace(/\-/g,'\\-');
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = decodeURI(window.location.search.substr(1)).match(reg);
            if(r!=null)return  decodeURI(r[2]); return null;
        },
        numtoFixed2: function(n, t = 2){
            return (Number(n) || 0).toFixed(t)
        },
        generateQRCode: function (rendermethod, picwidth, picheight, url) {
            $("#qrcode").qrcode({
             render: rendermethod, // 渲染方式有table方式（IE兼容）和canvas方式
             width: picwidth, //宽度 
             height: picheight, //高度 
             text: url, //内容 
             typeNumber: -1, //计算模式
             correctLevel: 0, //二维码纠错级别
             background: "#ffffff", //背景颜色
             foreground: "#000000" //二维码颜色
            });
            $("#show").attr('src',$('canvas').get(0).toDataURL("image/png")).show()
        }
    }
    landlordObj.getUserInfo()
})()