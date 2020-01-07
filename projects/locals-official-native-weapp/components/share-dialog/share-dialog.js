// components/share-dialog/share-dialog.js
import {authed_user} from '../../config/config'
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    path:{
      type:String,
      value:''
    },
    navigateToHouseDetailId:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: { 
    sid:null,
    isShow:false,
    isShowBtn:false,
    sharePath:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    stopTouchMove: function () {
      return false
    },
    showDialog(){
      this.setData({
        isShow:true
      })
    },
    _cancelShare(){
      this.setData({
        isShow:false
      })
    },
    onInput(e){
     if(this.data.navigateToHouseDetailId){
      this.setData({
        sid:e.detail.value.trim(),
        sharePath:'pages/index/index?sid='+e.detail.value+'&navigateToHouseDetailId='+this.data.navigateToHouseDetailId
      })
     }else{
      this.setData({
        sid:e.detail.value.trim(),
        sharePath:this.data.path+'?sid='+e.detail.value
      })
     }
      // app.globalData.sid=e.detail.value
    },
    copyPath(){
      wx.setClipboardData({
        data:this.data.sharePath
      })
    },
    share(){
      // if(!this.data.sid){
      //   // console.log(2222)
      //   wx.showToast({title:'请输入sid'})
      //   return false
      // }
      this.setData({
        isShow:false
      })
    },
    verify(){
      let userInfo=app.globalData.userInfo
      // let VIP=['18613058447','13432614798','18613175577',]
      authed_user.forEach(v=>{
        if(v==userInfo.mobile){
          this.setData({isShowBtn:true})
        }
      })
    }
  }
})
