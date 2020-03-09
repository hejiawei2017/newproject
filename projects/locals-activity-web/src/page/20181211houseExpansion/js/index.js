import '../css/reset.less'
import '../css/index.less'
import Config from "@js/config.js";
let api = Config.api;
$(function(){
    let indexObj = {
        searchText: '',
        init(){
            console.log('init', this)
            indexObj.getHouseList()
            indexObj.search()
        },
        search(){
            $("#search_form").on('submit', (e)=>{
                e.preventDefault()
                indexObj.searchText = $("#search_form input").val()
                indexObj.getHouseList()
            })
        },
        getHouseList(){
            let params = {}
            indexObj.searchText && (params.cityNameLike = indexObj.searchText)
            $.get(api + '/prod-plus/h5/house/development',params,(data)=>{
                console.log('getList', data);
                let list = data.data
                let str = ''
                list.map((item)=>{
                    str += `<li class="item">
                        <div class="item-img">
                            <img src="${item.image}" alt="">
                        </div>
                        <div class="item-content">
                            <p class="text">${item.title}</p>
                            <div class="item-button">
                                <a href="http://m.localhome.cn/m/mall/react-product-show/${item.houseSourceId}"><button>房源详情</button></a>
                                <a href="./houseDetail.html?houseSourceId=${item.houseSourceId}"><button class="total">业绩统计</button></a>
                            </div>
                        </div>
                    </li>`
                })
                $(".content .loading").hide()
                $(".content .list").html(str)
            })
        }
    }
    indexObj.init();
})

//保留两位小数并且整数部分三位一个逗号分隔符的数字金钱标准表示法：
//这里假设我们即不知道输入数字的整数位数，也不知道小数位数
/*将100000转为100,000.00形式*/
var dealNumber = function (money) {
    if (money && money != null) {
        money = String(money)
        var left = money.split('.')[0],
            right = money.split('.')[1]
        right = right
            ? right.length >= 2
                ? '.' + right.substr(0, 2)
                : '.' + right + '0'
            : '.00'
        var temp = left
            .split('')
            .reverse()
            .join('')
            .match(/(\d{1,3})/g)
        return (
            (Number(money) < 0 ? '-' : '') +
            temp
                .join(',')
                .split('')
                .reverse()
                .join('') +
            right
        )
    } else if (money === 0) {
        //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
        return '0.00'
    } else {
        return ''
    }
}
/*将100,000.00转为100000形式*/
var undoNubmer = function (money) {
    if (money && money != null) {
        money = String(money)
        var group = money.split('.')
        var left = group[0].split(',').join('')
        return Number(left + '.' + group[1])
    } else {
        return ''
    }
}
