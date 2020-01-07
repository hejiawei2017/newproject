const request = require('../utils/request.js')

// 上报formid以及prepayid
function reportFormid({ formId, type = 1 }) {
  if(formId === 'the formId is a mock one') return 
  const openId = wx.getStorageSync('openId')
  const userInfo = wx.getStorageSync('userInfo')
  if(openId && userInfo){
    const data = {
      openId,
      userId:userInfo.id,
      formId,
      type
    }
    return request.post('wechat/wx/open-id/form-id',data)
  }else{
    return
  }
}

module.exports = {
  reportFormid,
}