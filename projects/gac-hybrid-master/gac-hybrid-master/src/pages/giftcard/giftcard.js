import Vue from 'vue'
import GiftCard from './giftcard.vue'
// import { getToken } from '../../libs/sdk';
// import { getConfig } from '../../api/auth'
// var url = window.location.href.split('#')[0]

// 跳转到商详: GacJSBridge.toShopDetail(productid)
// 跳到微信分享: GacJSBridge.wxShare({path,title,imgurl})
// 保存海报到手机: GacJSBridge.saveImg(imgurl)
// 获取用户token: GacJSBridge.getToken()


// getConfig({
//   url:url
// }).then(res=>{
//     var resData = res.data;
//     console.log('############',url,res);
//     if(resData.code === 0){
      
//       wx.miniProgram.getEnv(function(data){
//         console.log('getEnv',data);
//       })
//       wx.ready(function(){
//         console.log('wxReady');
//       })
//       wx.error(function(){
//         console.log('wxError');
//       })
//       // wx.config({
//       //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//       //   appId: resData.data.appId, // 必填，公众号的唯一标识
//       //   timestamp: resData.data.timestamp, // 必填，生成签名的时间戳
//       //   nonceStr: resData.data.nonceStr, // 必填，生成签名的随机串
//       //   signature: resData.data.signature,// 必填，签名
//       //   jsApiList: ['chooseImage'] // 必填，需要使用的JS接口列表
//       // })

//       wx.config({
//         debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//         appId: 'wxb4fa9f5dc027d98c', // 必填，公众号的唯一标识
//         timestamp: 1564473065, // 必填，生成签名的时间戳
//         nonceStr: 'FpFo5xuoyvp9ClJr', // 必填，生成签名的随机串
//         signature: '8c36fffeae7bde72fea4f5885e48e47bc54e1270',// 必填，签名
//         jsApiList: ['chooseImage'] // 必填，需要使用的JS接口列表
//       })
//     }
    
// })
// console.log('xxxxxxxxxx')
// wx.config({
//   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//   appId: 'wxb4fa9f5dc027d98c', // 必填，公众号的唯一标识
//   timestamp: 1564474967, // 必填，生成签名的时间戳
//   nonceStr: '8xszLOruFn', // 必填，生成签名的随机串
//   signature: '466750a0fa0dd8f4ea7ea5391b9d8adcb98b2005',// 必填，签名
//   jsApiList: ['chooseImage'] // 必填，需要使用的JS接口列表
// })

// wx.miniProgram.getEnv(function(data){
//   console.log('getEnv',data);
// })
// wx.ready(function(){
//   console.log('wxReady');
// })
// wx.error(function(){
//   console.log('wxError');
// })


new Vue({
    render: h => h(GiftCard)
}).$mount('#app')

