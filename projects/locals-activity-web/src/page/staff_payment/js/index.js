import 'babel-polyfill'
import '../css/mui.css'
import '../css/reset.css'
import '@js/flexible.min.js'
import '../css/index.less'
$(function() {
    let aiiPord = {
        data: {
            dataList : [],
            aDate : '',
            aDateStr : '',
            pageNum : 1,
            pageSize : 50,
            total : null,
            openId : '',
            userId : undefined,
            employeeId : undefined,
            MonthData : {},
            dayData : [],
            localAtr: 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com'
        },
        init: function(){
            // this.data.openId = this.GetQueryString('openId')
            let userId = this.data.userId = this.GetQueryString('userId'),
                employeeId = this.data.employeeId = this.GetQueryString('employeeId')
            this.buttonTap()
            if(userId || employeeId ){ 
                this.getDateData()
            }
            this.muiInit()
        },
        request: function(url,data,successFn,errorFn){
            let api = 'http://ms.localhome.cn/api'
            $.ajax(api + url, {
                dataType: 'json',
                data: data,
                success: successFn,
                error: errorFn
            })
        },
        getDateData:function(){
            let {userId, employeeId} = this.data
            let that = this
            this.request(`/report/exist-date-list/${userId || employeeId}`, {}, function(res){  // 请求成功的回调函数
                // console.log('res', res)
                let dataList= that.data.dataList = res.data
                let aDate= that.data.aDate = dataList.length > 0 ? dataList[dataList.length-1].statDateTime : ''
                that.data.aDateStr = dataList.length > 0 ? dataList[dataList.length-1].statDateTimeShortStr : ''
                that.setDateSelect(dataList)
                that.getDataPord(aDate)
                $('.monthlist .download_detail').show();
            }, ()=>{
                alert('用户暂时没有数据！')
            })
        },
        getDataPord: function (date){
            // 获取数据中转function
            this.getMonthKpi(date)
            this.getDayKpi(date)
        },
        getMonthKpi: function (date) {
            // 获取月数据
            let that = this
            let {aDate, userId, employeeId} = this.data
            if(aDate && (userId || employeeId)){
                this.request('/report/assistant-month-kpi',{
                    dateTime: date,
                    userId: userId,
                    employeeId: employeeId
                },function(res){  // 请求成功的回调函数
                    that.data.MonthData = res.data
                    that.setMonth(res.data, that.data.aDateStr)
                },function() {
                    alert('请刷新一次，再次进入')
                })
            }
        },
        getDayKpi:function(date){
            let that = this
            let {aDate, userId, employeeId, pageNum, pageSize, aDateStr} = this.data
            if(aDate && (userId || employeeId)){
                this.request('/report/assistant-daily-kpi', {
                    dateTime: date,
                    userId: userId,
                    employeeId: employeeId,
                    pageNum: pageNum,
                    pageSize: pageSize
                }, function(res){  // 请求成功的回调函数
                    that.data.dayData.push(...res.data.list)
                    let dayData = that.data.dayData
                    that.data.total = Number(res.data.total) || 0
                    that.setDay(dayData, aDateStr)
                },
                function(error) {
                    alert('请刷新一次，再次进入')
                });
            }
        },
        setDateSelect: function (dataList){
            let changeDate = $('#changeDate')
            let optionStr = ''
            for (let index = 0; index < dataList.length; index++) {
                optionStr += `<option value="${dataList[index].statDateTime}">${dataList[index].statDateTimeShortStr}</option>`
            }
            changeDate.append(optionStr);
            if(dataList.length > 0){
                changeDate.find("option:last-child").attr("selected",true)
            }
        },
        setDay: function (dayData){
            let dayList = ''
            $('.daylist')[0].innerHTML = ''
            for (let index = 0; index < dayData.length; index++) {
                let element = dayData[index];
                dayList += `<div class="item">
                        <div>
                            <div class="item-top">
                                <i class="icon-day"></i>
                                <div class="rewardName">${element.rewardName}</div>
                                <div class="time"><span class="monthDate">${element.dateTimeStr}</span></div>
                            </div>
                            <div class="item-body">
                                <div class="content color666">${element.rewardDesc}</div>
                            </div>
                        </div>
                        <div>¥ <span class="reward">${this.numtoFixed2(element.reward)}</span></div>
                    </div>`
            }
            $('.daylist').append(dayList)
        },
        setMonth: function (MonthData, aDateStr){
            $('.userName')[0].innerHTML = MonthData.nickName
            $('.selectDate')[0].innerHTML = aDateStr
            $('.selectDate')[1].innerHTML = aDateStr
            $('.monthTotalReward')[0].innerHTML = MonthData.monthTotalReward
            $('.monthReward')[0].innerHTML = MonthData.monthReward
            $('.dailyTotalReward')[0].innerHTML = MonthData.dailyTotalReward
            $('.dailyReward')[0].innerHTML = MonthData.dailyReward
            $('.monthlist .item .monthDate').text(aDateStr)
          $('.monthlist .item .content')[0].innerHTML = MonthData.monthPraiseDesc
          $('.monthlist .item .reward')[0].innerHTML = this.numtoFixed2(MonthData.monthPraiseReward)

            $('.monthlist .item .content')[1].innerHTML = MonthData.monthLocalsOrderDesc
            $('.monthlist .item .reward')[1].innerHTML = this.numtoFixed2(MonthData.monthLocalsOrderReward)

          $('.monthlist .item .content')[2].innerHTML = MonthData.monthCheckInDesc
          $('.monthlist .item .reward')[2].innerHTML = this.numtoFixed2(MonthData.monthCheckInReward)

            $('.monthlist .item .content')[3].innerHTML = MonthData.monthKeyNoteDesc || "每月公司安排运营重点工作的落地情况，由总部运营检查邮件通知"
            $('.monthlist .item .reward')[3].innerHTML = this.numtoFixed2(MonthData.monthKeyNoteReward)
            let monthText = {
                1:'一月',
                2:'二月',
                3:'三月',
                4:'四月',
                5:'五月',
                6:'六月',
                7:'七月',
                8:'八月',
                9:'九月',
                10:'十月',
                11:'十一月',
                12:'十二月',
            }
            $(".monthText")[0].innerText = monthText[Number(aDateStr.split("月")[0])] || ''
        },
        setDownButtonFn: function (){
            let that = this
            var download_detail_list = $('.monthlist .download_detail')
            for(let i = 0; i < download_detail_list.length; i++){
                download_detail_list[i].addEventListener('tap', function(e){
                    that.downloadReport(e.target.getAttribute('data-index'))
                })
            }
        },
        downloadReport: function(index) {
            let {aDate, userId, employeeId, localAtr} = this.data
            this.request('/report/assistant-excel-detail-export', {
                    statChannel: index,
                    dateTime: aDate,
                    userId: userId,
                    employeeId: employeeId
                },function(res){  // 请求成功的回调函数
                    // console.log('res', res)
                    if(res.success){
                        window.location.href = localAtr + res.data
                    }else{
                        alert("该报表暂无数据！")
                    }
                },function(error) {
                    alert('请刷新一次，再次进入')
                }
            );
        },
        buttonTap: function(){
            $("#changeDate").change(this.dateChangefn)
            $(".card").on('tap', '.icon-shuoming',function(){
                $('#modalTpis').show();
            })
            $('#modalTpis')[0].addEventListener('tap',function(e){
                e.stopPropagation()
                $('#modalTpis').hide();
            },false)
            $('#modalTpis .modal-scroll')[0].addEventListener('tap',function(e){
                e.stopPropagation()
            },false)
            this.setDownButtonFn()
        },
        dateChangefn: function(e){
            // 日期选择改变
            let aDate = e.target.value
            let dataList = aiiPord.data.dataList
            aiiPord.data.dayData = []
            aiiPord.data.pageNum = 1
            aiiPord.data.aDate = aDate
            aiiPord.data.aDateStr = $('#changeDate option:selected').text()
            // console.log(aDate)
            mui('#refreshContainer').pullRefresh().refresh(true);
            aiiPord.getDataPord(aDate)
            var date = new Date();
            var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
            var enddate = new Date(new Date().getFullYear(), new Date().getMonth()-1, day);

            if(aDate >= enddate){
                $('.download_detail').show()
            }else{
                $('.download_detail').hide()
            }
        },
        muiInit: function(){
            let that = this
            mui.init({
                pullRefresh : {
                    container: '#refreshContainer',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
                    up : {
                        height: 50,//可选.默认50.触发上拉加载拖动距离
                        // auto:true,//可选,默认false.自动上拉加载一次
                        contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                        contentnomore:'我是有底线的',//可选，请求完毕若没有更多数据时显示的提醒内容；
                        callback: function(){
                            that.loadMore(this);
                        }
                    }
                }
            })
        },
        loadMore: function(pullfresh){
            // 加载更多
            let {
                total,
                aDate,
                pageSize,
                pageNum
            } = this.data
            if(total/pageSize > pageNum ){
                pullfresh.endPullupToRefresh(false);
                this.data.pageNum++
                this.getDayKpi(aDate)
            }else{
                pullfresh.endPullupToRefresh(true);
            }
        },
        GetQueryString: function (name){
            if(name.match(/\[|\]|\-/) !=null && name.match(/\[|\]|\-/).length >0)name=name.replace(/\[/g,'\\[').replace(/\]/g,'\\]').replace(/\-/g,'\\-');
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = decodeURI(window.location.search.substr(1)).match(reg);
            if(r!=null)return  decodeURI(r[2]); return undefined;
        },
        numtoFixed2: function (n){
            return (Number(n) || 0).toFixed(2)
        }
    }
    aiiPord.init()
});
