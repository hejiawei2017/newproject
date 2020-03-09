'use strict';
const BaseController = require('../../core/base-controller');
const moment = require('moment');

module.exports = class extends BaseController {
  // 后期开发 VS 插件用于处理每一个活动单独的业务逻辑

  async callFunction(method, activityId, payload) {
    try {
      const func = this[`${method}_${activityId}`];
      const response = await (func
        ? func.call(this, payload)
        : this.errno.SUCCESS);
      this.ctx.body = response;
    } catch (error) {
      this.app.errorLog(error);
      this.ctx.body = this.errno.SERVER;
    }
  }

  async index() {
    const data = this.filter(
      { activity_id: 'string', payload: 'string' },
      this.ctx.query
    );
    if (!data) {
      return;
    }

    await this.callFunction('GET', data.activity_id, data.payload);
  }

  async create() {
    const data = this.filter({ activity_id: 'string', payload: 'string' });

    if (!data) {
      return;
    }

    await this.callFunction('POST', data.activity_id, data.payload);
  }

  async update() {
    const data = this.filter({ activity_id: 'string', payload: 'string' });
    if (!data) {
      return;
    }
    await this.callFunction('PUT', data.activity_id, data.payload);
  }

  // 每个活动需要的特殊处理
  async POST_1902210804335(data) {
    const parseData = JSON.parse(data);
    // 判断用户是否关注
    const openId = parseData.openId;
    if (!openId) {
      return this.errno.PARAMS;
    }
    const row = await this.app.model_platform.User.findOne({
      where: { app_open_id: openId },
    });

    const response = await this.service.record.create(
      openId,
      JSON.stringify({
        ...parseData,
        create_time: moment().format('YYYY-MM-DD hh:mm:ss'),
        exists: row ? '老用户' : '新用户',
      }),
      'tachun_20190221'
    );

    return response;
  }

  async POST_1902270815251(data) {
    const parseData = JSON.parse(data);
    const openId = parseData.openId || parseData.appOpenId || parseData.unionId;

    const recordDetail = await this.service.record.find('KJ_20190227', openId);

    const friendsDetail = await this.service.coupon.getParentLists(
      '1902270815251',
      parseData.openId
    );

    if (!friendsDetail.success) {
      return friendsDetail;
    }

    const isNotFound =
      !recordDetail.success &&
      recordDetail.errorCode === this.errno.NOTFOUND.errorCode;

    if (!isNotFound) {
      return {
        ...recordDetail,
        data: {
          ...JSON.parse(recordDetail.data),
          friends: friendsDetail.data.map(this._friendUserInfo),
        },
      };
    }

    let userLauchDetail = recordDetail.data;
    if (isNotFound) {
      // TODO
      userLauchDetail = await this.service.record.create(
        openId,
        JSON.stringify({
          price: 59,
          openId,
          userInfo: parseData,
          start_time: Date.now(),
        }),
        'KJ_20190227'
      );
    }
    if (!userLauchDetail.success) {
      return userLauchDetail;
    }

    // 查找邀请列表
    return {
      ...this.errno.SUCCESS,
      data: {
        ...JSON.parse(userLauchDetail.data),
        friends: friendsDetail.data.map(this._friendUserInfo),
      },
    };
  }

  _friendUserInfo(detail) {
    const userInfo = JSON.parse(detail.master_info);

    return {
      price: detail.master_coupons_price,
      userInfo: {
        avatar: userInfo.avatar,
        nick_name: userInfo.nickName,
      },
    };
  }

  async GET_1902270815251(openId) {
    const recordDetail = await this.service.record.find('KJ_20190227', openId);
    if (!recordDetail.success) {
      return recordDetail;
    }

    const data = JSON.parse(recordDetail.data);
    const friendsDetail = await this.service.coupon.getParentLists(
      '1902270815251',
      data.userInfo.openId
    );

    if (!friendsDetail.success) {
      return friendsDetail;
    }

    return {
      ...this.errno.SUCCESS,
      data: {
        ...data,
        friends: friendsDetail.data.map(this._friendUserInfo),
      },
    };
  }

  async PUT_1902270815251(data) {
    const parentOpenId = this.ctx.params.id;
    // 砍掉的金额
    const response = await this.GET_1902270815251(parentOpenId);

    if (!response.success) {
      return response;
    }

    const payloadData = JSON.parse(data);

    if (payloadData.update) {
      delete payloadData.update;
      Object.assign(response.data, payloadData);
      const updateResponse = await this.service.record.update(
        parentOpenId,
        { data: JSON.stringify({ ...response.data, friends: undefined }) },
        'KJ_20190227'
      );

      if (!updateResponse.success) {
        return updateResponse;
      }
      return response;
    }

    const userInfo = payloadData;
    if (response.data.friends.length >= 5) {
      return this.errno.MAXIMUM;
    }

    const parentUserInfo = response.data.userInfo;
    const currentPrice = Number(response.data.price);
    let bargainPrice = 0;
    let seed = 15;
    if (currentPrice < 30) {
      seed = 5;
    }
    if (currentPrice < 20) {
      seed = 3;
    }

    bargainPrice = Math.floor(Math.random() * seed) + 3;

    try {
      const row = await this.app.model_hd.Coupon.findOne({
        where: { master_uuid: userInfo.openId, activity_id: '1902270815251' },
        raw: true,
      });
      if (row) {
        return this.errno.EXISTS;
      }
    } catch (error) {
      this.logger.error(error);
    }

    const receiveResponse = await this.service.coupon.create(
      '1902270815251',
      userInfo.openId,
      data,
      '',
      bargainPrice,
      parentUserInfo.openId,
      JSON.stringify(parentUserInfo),
      '',
      bargainPrice
    );

    if (!receiveResponse.success) {
      return receiveResponse;
    }
    response.data.price = currentPrice - bargainPrice;

    response.data.friends.push({
      price: bargainPrice,
      userInfo: { avatar: userInfo.avatar, nick_name: userInfo.nickName },
    });

    const updateResponse = await this.service.record.update(
      parentOpenId,
      { data: JSON.stringify({ ...response.data, friends: undefined }) },
      'KJ_20190227'
    );

    if (!updateResponse.success) {
      return updateResponse;
    }
    return response;
  }
};
