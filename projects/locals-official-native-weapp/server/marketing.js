const request = require('../utils/request.js')
const app = getApp()

// 获取userid对应邀请码
function getSelfInviteCode(){
  return request.get(`/act/mark-invitation-code/create`, { businessId:'1143078431431962624' })
}

// 新增邀请码记录
function addInviteRecord(data){
  return request.post(`/act/mark-invitation-code-user`,data)
}

// 通过userid获取邀请码
function getInviteCodeByUid(userid){
  return request.get(`/act/mark-invitation-code/user?businessId=1143078431431962624&userId=${userid}`)
}

module.exports = {
  getSelfInviteCode,
  addInviteRecord,
  getInviteCodeByUid
}
