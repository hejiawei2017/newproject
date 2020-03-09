import 'babel-polyfill'
// import '../css/mui.min.css'
import '../css/reset.css'
import '@js/flexible.min.js'
import '../css/housingList.less'
import '../css/loading.less'
(function (){
    let landlordObj = {
        dataList: [],
        pageNum: 1,
        pageSize: 10,
        total: null,
        url:'http://ms.localhome.cn/api/v2',
        api:{
            getTable: '/prod/display/houses/'
        },
        imgFix:'http://app.localhome.cn/',
        getTable: function (){
            let userId = this.getQueryString("userId");
            if(!userId)return false
            $.ajax({
                type: "GET",
                url: `${this.url}${this.api.getTable}${userId}`,
                data:{
                    // memberId: userId,
                    // pageNum: this.pageNum,
                    // pageSize: this.pageSize
                },
                dataType: 'json',
                success: (e)=>{
                    console.log('get', e)
                    let data = e.data;
                    if(data){
                        this.total = data.total
                        $(".user-avatar").attr("src","http://app.localhome.cn/"+data.avatar)
                        $(".user-name").text(data.nickName)
                        this.dataList.push(data.housesList)
                        this.dataDomList(data.housesList)
                        $(".spinner").hide();
                        $('.mui-scroll-wrapper').show();
                    }else{
                        alert('暂无数据！')
                        $('body').append('<div class="mt10 nodata">暂无数据</div>')
                    }
                }
            })
        },
        loadMore: function (pullfresh) {
            // console.log('pullfresh')
            if(this.total > 0 && this.total/this.pageSize > this.pageNum ){
                pullfresh.endPullupToRefresh(false);
                this.pageNum ++
                this.getTable()
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
        numtoFixed2: function(n){
            return (Number(n) || 0).toFixed(2)
        },
        linkUrl: function(oldId){
            location.href = `http://wxpt.localhome.cn/?share=pageshare&shp=houseDetailInfo&shareId=${oldId}&from=singlemessage&isappinstalled=0`
        },
        dataDomList: function(data){
            // var datailImg = 'http://120.76.204.105/upload/180627/FUOOL180627224951836.jpeg';
            // http://app.localhome.cn/UploadFiles/HouseSource/378196/378196_180216180404_3216f3e4c24d40ca83adc90ace650e6a.jpg
            let aData = data.map(item=>{
                var datailImg = 'http://app.localhome.cn' + item.showImg;
                let imgUrl = item.houseImages && item.houseImages[0] && item.houseImages[0].imagePath ? this.imgFix + item.houseImages[0].imagePath : datailImg;
                let standardPrice = this.numtoFixed2(item.standardPrice).split('.')
                return (`<div class="wall-item">
                            <div>
                                <img src="${imgUrl}" />
                                <h2>${item.title}</h2>
                                <div  class="item-info">
                                    <span>
                                        ￥
                                        <span class="money">${standardPrice[0]}</span><span>.${standardPrice[1]}</span>
                                    </span>
                                    <a href="http://wxpt.localhome.cn/?share=pageshare&shp=houseDetailInfo&shareId=${item.oldId}&from=singlemessage&isappinstalled=0">立即预订</a>
                                </div>
                            </div>
                        </div>`)
            })
            $(".wall-column").append(aData)
        }
    }
    landlordObj.getTable()
    // mui.init({
    //     pullRefresh : {
    //         container: '#refreshContainer',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
    //         up : {
    //             height: 50,//可选.默认50.触发上拉加载拖动距离
    //             // auto:true,//可选,默认false.自动上拉加载一次
    //             contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
    //             contentnomore:'我是有底线的',//可选，请求完毕若没有更多数据时显示的提醒内容；
    //             callback: function(){
    //                 // landlordObj.loadMore(this);
    //                 this.endPullupToRefresh(true);
    //             }
    //         }
    //     }
    // })
})()