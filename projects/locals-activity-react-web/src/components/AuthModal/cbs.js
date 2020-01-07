import { registerMemberInfo, sendCouponNewUser } from '../../common/api'

import Toast from '../Toast'

function getOptions () {
  const token = localStorage.getItem('LOCALS-ACCESS-TOKEN') || ''
  const options = {
    headers: {
      'LOCALS-ACCESS-TOKEN': token
    }
  }
  return options
}

/**
 * 获取新人红包
 */
async function getRedpacket (ops) {
  const { mobile, userInfo = {}, sid = '' } = ops
  const params = {
    phone: mobile,
    userInfo: JSON.stringify(userInfo),
    traceId: sid,
    activity_id: '1902220547571'
  }
  const res = await sendCouponNewUser(params, getOptions())
  if (res.success) {
    Toast.text('领取红包成功！')
  }
}

/**
 * 获取普卡
 */
async function getNormalMemberCard () {
  const res = await registerMemberInfo({}, getOptions())
  if (res.success) {
    Toast.text('成功升级普卡！')
  }
}

// 登录及注册成功回调
export default {
  loginCbs: {
    getRedpacket
  },
  registerCbs: {
    getNormalMemberCard
  }
}
