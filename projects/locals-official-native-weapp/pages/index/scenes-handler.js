const { springRelation } = require('../../server/index');

const app = getApp();

module.exports = options => {
  const { springRalationFromUserId } = options;
  const userInfo = wx.getStorageSync('userInfo');
  const taskList = [];
  // 根据场景传进来的数据
  if (!!springRalationFromUserId) {
    taskList.push(userInfo => {
      springRelation({
        from_user_id: springRalationFromUserId,
        id: userInfo.id,
        city: 'miniprogram-city',
      });
    });
  }

  // 如果已经拿到用户信息了则直接调用
  if (userInfo) {
    taskList.forEach(task => task(userInfo))
    return
  }
  // 否则加入到 global 队列中等待获取到用户信息
  app.globalData.taskList.push.apply(app.globalData.taskList, taskList)
};
