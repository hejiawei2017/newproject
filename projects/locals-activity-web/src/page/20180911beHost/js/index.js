require("@js/flexible.min.js");
require('../css/index.less');
require('../css/reset.less')
// require('normalize.css')
import 'normalize.css'
import Config from '@js/config.js'
import 'babel-polyfill'
import {showBody,telRegExp} from "../../../js/util";



$(function(){
    showBody();
    let cityArr=['北京','广州','成都','重庆','杭州','西安','青岛','厦门','武汉','上海','南京','三亚','桂林','丽江','珠海','长沙','苏州','天津','秦皇岛','大理','昆明','济南','乌鲁木齐','深圳','郑州',
'合肥','咸宁','无锡','惠州','海口','南昌','宁波','哈尔滨','烟台','大连','太原','石家庄','扬州','贵阳','兰州','西宁','开封','洛阳','福州','南宁','咸宁','拉萨']
    let html=`<option value="城市">城市</option>`
    cityArr.forEach((v)=>{
        html+=`<option value="${v}">${v}</option>`
    })
    $('#city').html(html)
    $('#register').click(()=>{
        let scrollTop=$(window).scrollTop()
        let offsetTop=$('#form').offset().top
        if(scrollTop<offsetTop-200){
            $(window).scrollTop(offsetTop)
        }else{
            goRegister()
        }
    })

    function goRegister(){
        let name=$('#name').val().trim()
        let phone=$('#phone').val().trim()
        let houseType=$('#house-type').val().trim()+'室'+$('#house').val().trim()+'厅'+$('#room').val().trim()+'卫'
        let community=$('#community').val().trim()
        let city=$('#city').val()
        let address=$('#address').val()

        if(!name || !phone || !houseType || !community || city==='城市' || !address){
            alert('请输入完整信息')
        }
    }
        
})