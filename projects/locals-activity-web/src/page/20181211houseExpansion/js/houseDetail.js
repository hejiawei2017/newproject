import "../css/reset.less";
import "../css/houseDetail.less";
import Config from "@js/config.js";
let api = Config.api;

$(function(){
    var detailObj = {
        data:{
            houseSourceId: '',
            aYear: null,
            aMonth: null,
            initYear: null,
            initMonth: null,
            newDate: new Date(),
            houseCalendarList: [],
            maxMonth: 6
        },
        init(){
            let houseSourceId = detailObj.GetQueryString('houseSourceId')
            if(houseSourceId){
                detailObj.data.houseSourceId = houseSourceId
                detailObj.setDateSelClick()
                detailObj.getHouseIncome()
                detailObj.getHouseCalendar()
            }
        },
        setDateSelClick: ()=>{
            let data = detailObj.data
            data.aYear = data.newDate.getUTCFullYear()
            data.initYear = data.newDate.getUTCFullYear()
            data.aMonth = data.newDate.getMonth() + 1
            data.initMonth = data.newDate.getMonth() + 1
            detailObj.changeCalendarBox()
            $(".calendar-box .box-data-select .select-left").click(detailObj.dataChange.bind(null, 'first'))
            $(".calendar-box .box-data-select .select-right").click(detailObj.dataChange.bind(null, 'last'))
        },
        dataChange: (type) =>{
            let aNum = type === 'first' ? -1 : 1;
            let data = detailObj.data
            let {
                aYear,
                aMonth,
                initYear,
                initMonth,
                maxMonth
            } = data
            aMonth += aNum;
            let len = (initYear - aYear) * 12 + (initMonth - aMonth)
            console.log('len',len, `${initYear}/${initMonth}`, `${aYear}/${aMonth}`)
            if(Math.abs(len) < maxMonth || (len > 0 && aNum === 1)){
                if(aMonth > 12){
                    data.aYear++
                    data.aMonth = 1 
                }else if(aMonth < 1){
                    data.aYear--
                    data.aMonth = 12
                }else{
                    data.aMonth = aMonth
                }
                $(".loading-Pord").show()
                data.newDate = new Date(data.aYear, data.aMonth - 1, 1);
                detailObj.getHouseIncome()
                detailObj.getHouseCalendar()
            }
        },
        changeCalendarBox: () => {
            let {newDate, houseCalendarList}  = detailObj.data
            if(newDate){
                let dataFirst = newDate.getDay()
                let monthLength = newDate.getMonthLength()
                let setDate = newDate.Format("yyyy/MM")

                console.log(setDate, dataFirst, monthLength, newDate)
                let week = Math.ceil((monthLength + dataFirst)/7)
                let atbody = ''
                for (let i = 0; i < week; i++) {
                    let aTd = ''
                    for (let k = 0; k < 7; k++) {
                        let index = i * 7 + k - dataFirst
                        if(index >= 0 && index < monthLength){
                            var idata = houseCalendarList[index] || {}
                            if(idata.calendarOrderList && idata.calendarOrderList.length > 0){
                                var startDate =  idata.calendarOrderList[0].checkinDate
                                var endDate = idata.calendarOrderList[idata.calendarOrderList.length - 1].checkoutDate
                                if(startDate && endDate){
                                    endDate -= 60*60*24*1000
                                    startDate = new Date(startDate).Format("yyyy/MM/dd")
                                    endDate = new Date(endDate).Format("yyyy/MM/dd")
                                }
                                let kd = new Date(setDate + '/' + (index + 1)).Format("yyyy/MM/dd")
                                console.log('dataFirst', startDate, endDate, kd)

                                aTd += `<td class="active ${(startDate === kd) && 'startDate'} ${(endDate === kd) && 'endDate'}">
                                            <p class="date">${ index + 1}</p>
                                            <p class="price">${idata.price ? `￥${idata.price}` : '&nbsp;'}</p>
                                        </td>`
                            }else{
                                aTd += `<td>
                                            <p class="date">${ index + 1}</p>
                                            <p class="price">${idata.price ? `￥${idata.price}` : '&nbsp;'}</p>
                                        </td>`
                            }
                        }else{
                            aTd += `<td></td>`
                        }
                    }
                    atbody += `<tr>${aTd}</tr>`
                }
                $(".calendar-box .box-data-select .select-main").text(setDate)
                $('.calendar-box tbody').html(atbody)
            }
        },
        getHouseIncome(){
            let {houseSourceId, aYear, aMonth} = detailObj.data
            let params = {
                year: aYear,
                month: aMonth
            }
            $.get(`${api}/prod-plus/h5/house/${houseSourceId}/room-nights-income`, params, (data)=>{
                if(data.data && data.success){
                    let {
                        futureIncome,
                        futureRoomNight,
                        monthIncome,
                        monthRoomNight
                    } = data.data
                    $(".house-data .lateMonth .data").text(monthRoomNight)
                    $(".house-data .behindIncome .data").text(detailObj.dealNumber(futureIncome))
                    $(".house-data .LateBehind .data").text(futureRoomNight)
                    $(".house-data .monthIncome .data").text(detailObj.dealNumber(monthIncome))
                }
            })
        },
        getHouseCalendar(){
            let {houseSourceId, aYear, aMonth} = detailObj.data
            let params = {
                year: aYear,
                month: aMonth
            }
            $.get(`${api}/prod-plus/h5/house/${houseSourceId}/calendar`, params, (data)=>{
                console.log('data', data)
                if(data.data && data.success){
                    let {
                        memberHousesList
                    } = data.data
                    $(".loading-Pord").hide()
                    $(".house-box, .calendar-box").show()
                    if(memberHousesList && memberHousesList.length > 0){
                        let { 
                            houseCalendarList,
                            address,
                            houseNo,
                            images,
                            title,
                            workflowStatus
                        } = memberHousesList[0]
                        detailObj.data.houseCalendarList = houseCalendarList
                        detailObj.data.address = address
                        detailObj.data.houseNo = houseNo
                        detailObj.data.images = images
                        detailObj.data.title = title
                        detailObj.data.workflowStatus = workflowStatus
                        $(".house-box .detail-img img").attr('src', images)
                        $(".house-box .detail-no").text('房源编码：' + houseNo)
                        $(".house-box .detail-text").text(title)
                        detailObj.changeCalendarBox()
                    }
                }
            })
        },
        GetQueryString(name){
            if(name.match(/\[|\]|\-/) !=null && name.match(/\[|\]|\-/).length >0)name=name.replace(/\[/g,'\\[').replace(/\]/g,'\\]').replace(/\-/g,'\\-');
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = decodeURI(window.location.search.substr(1)).match(reg);
            if(r!=null)return  decodeURI(r[2]); return null;
        },
        dealNumber(money){
            if (money && money != null) {
                money = String(money)
                var left = money.split('.')[0],
                    right = money.split('.')[1]
                right = right ? right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0' : '.00'
                var temp = left.split('').reverse().join('').match(/(\d{1,3})/g)
                return (
                    (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right
                )
            } else if (money === 0) {
                //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
                return '0.00'
            } else {
                return ''
            }
        }
    }

    detailObj.init()
})
Date.prototype.Format = function(fmt){
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
Date.prototype.getMonthLength = function(){
    return new Date(this.getUTCFullYear(), this.getMonth() + 1, 0).getDate()
}

//保留两位小数并且整数部分三位一个逗号分隔符的数字金钱标准表示法：
//这里假设我们即不知道输入数字的整数位数，也不知道小数位数
/*将100000转为100,000.00形式*/
// var dealNumber = function (money) {
//     if (money && money != null) {
//         money = String(money)
//         var left = money.split('.')[0],
//             right = money.split('.')[1]
//         right = right
//             ? right.length >= 2
//                 ? '.' + right.substr(0, 2)
//                 : '.' + right + '0'
//             : '.00'
//         var temp = left
//             .split('')
//             .reverse()
//             .join('')
//             .match(/(\d{1,3})/g)
//         return (
//             (Number(money) < 0 ? '-' : '') +
//             temp
//                 .join(',')
//                 .split('')
//                 .reverse()
//                 .join('') +
//             right
//         )
//     } else if (money === 0) {
//         //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
//         return '0.00'
//     } else {
//         return ''
//     }
// }
// /*将100,000.00转为100000形式*/
// var undoNubmer = function (money) {
//     if (money && money != null) {
//         money = String(money)
//         var group = money.split('.')
//         var left = group[0].split(',').join('')
//         return Number(left + '.' + group[1])
//     } else {
//         return ''
//     }
// }
