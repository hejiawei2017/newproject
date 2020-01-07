const request = require('../utils/request.js');
const ENV = require('../config/env-config.js').env
const {nodeApi} = require('../config/param-config.js');

if (ENV !== 'prod') {
  console.warn('请不要校验合法域名');
}
// 统计相关

exports.share = function({ ticket_id, type, page, desc }) {
  const userInfo = wx.getStorageSync('userInfo');
  if (!userInfo) {
    return;
  }
  return request.post( `${nodeApi}/statistics/share`, {
    ticket_id,
    user_id: userInfo.id,
    type,
    page,
    desc,
  });
};

exports.joinShare = function({ ticket_id, share_user_id }) {
  const userInfo = wx.getStorageSync('userInfo');
  if (!userInfo) {
    return;
  }
  return request.post(`${nodeApi}/statistics/share_join`, {
    ticket_id,
    share_user_id,
    join_user_id: userInfo.id,
  });
};

exports.statisticsEvent = function({ share_user, event, desc, activity_name }) {
  const userInfo = wx.getStorageSync('userInfo');
  if (!userInfo) {
    return;
  }
  return request.post(`${nodeApi}/statistics/event`, {
    user_id: userInfo.id,
    share_user,
    event,
    desc,
    activity_name,
  });
};

const { receiveCoupon } = require('./mine');

exports.receiveSummerCoupon = function() {
  const userInfo = wx.getStorageSync('userInfo')
  if (!userInfo) {
    return;
  }
  const { mobile } = userInfo
  const prodCode = '9842F2461';
  const devCode = 'AE07337EB';
  const params = {
    mobile,
    code: ENV === 'prod' ? prodCode : devCode,
    platform: 'MINI_PROGRAM',
  }
  return receiveCoupon(params);
}

/**
 * 创建砍价活动
 */
exports.createBargain = ({orderId, createrId, createrInfo}) => {
  return request.ajaxPost(`${nodeApi}/bargain/create`, {
    creater_id: createrId,
    order_id: orderId,
    creater_info: createrInfo,
  });
}

/**
 * 获取砍价活动状态和订单状态
 * @param orderId
 * @param createrId
 * @returns {*|Promise}
 */
exports.getBargainStatus = ({orderId, createrId}) => {
  return request.ajaxGet(`${nodeApi}/bargain/get-status`, {
    creater_id: createrId,
    order_id: orderId,
  });
}

/**
 * 批量获取砍价活动状态和订单状态
 * @param list {Array}
 * @returns {*|Promise}
 */
exports.getBargainStatusList = (list) => {
  return request.ajaxGet(`${nodeApi}/bargain/get-status-list`, {list});
}

/**
 * 删除砍价活动相关数据
 * @param orderId
 * @returns {*|Promise}
 */
exports.deleteBargainOrder = (orderId) => {
	return request.ajaxDelete(`${nodeApi}/bargain/delete/${orderId}`, {});
}

/**
 * 微信广告数据上报
 * @param data
 * @returns {*|Promise}
 */
exports.trackingConversionAd = (data) => {
  return request.post(`${nodeApi}/wechat/trackingConversionAd`, data);
}


/**
 * 获取网红民宿活动相关数据
 * @param pageNum
 * @param pageSize
 * @returns {*|Promise}
 */
exports.getFamousData = (params) => {
	return request.ajaxGet(`${nodeApi}/web-hot-house/list`, params);
}
