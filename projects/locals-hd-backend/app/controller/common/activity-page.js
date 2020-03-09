'use strict';

const BaseController = require('../../core/base-controller');

class PageController extends BaseController {
  // 未找到活动
  _notFound(data) {
    return !data || !data.activityDetail || data.activityDetail.delete_time;
  }

  // 活动未开始
  _notYet({ activityDetail }) {
    const { app } = this;
    const { ACTIVITY_STATE } = app.const.index;
    if (ACTIVITY_STATE.START === activityDetail.state) {
      return false;
    }

    return new Date(activityDetail.start_time) > Date.now();
  }

  // 活动已结束
  _end({ activityDetail }) {
    const { app } = this;
    const { ACTIVITY_STATE } = app.const.index;
    if (ACTIVITY_STATE.END === activityDetail.state) {
      return true;
    }

    return new Date(activityDetail.end_time) < Date.now();
  }

  // 活动未上线
  _notOnline({ activityDetail }, versionNo) {
    return !versionNo && !activityDetail.version_id;
  }

  // 获取版本信息
  _getVersionInfo({ versions, activityDetail }, versionNo) {
    const versionKeys = Object.keys(versions);
    if (!versionKeys.length) {
      return null;
    }

    // 获取线上版本
    if (!versionNo) {
      return versions[activityDetail.version_id];
    }

    // 获取最新版本
    if (versionNo === 'preview') {
      const sortKeys = versionKeys.sort((a, b) => {
        const aTime = new Date(versions[a].create_time);
        const bTime = new Date(versions[b].create_time);
        return aTime < bTime;
      });
      return versions[sortKeys[0]];
    }

    const versionKey = versionKeys.find(
      key => versions[key].version === versionNo
    );

    if (!versionKey) {
      return null;
    }

    // 根据版本号获取版本
    return versions[versionKey];
  }

  async index() {
    const { service, ctx } = this;
    const activityId = ctx.params.id;
    const versionNo = ctx.query.v;

    const { data } = await service.activity.get(activityId);

    if (this._notFound(data)) {
      this.ctx.body = '<p>未找到相关活动</p>';
      return;
    }
    if (this._notYet(data)) {
      this.ctx.body = '<p>活动未开始</p>';
      return;
    }
    if (this._end(data)) {
      this.ctx.body = '<p>活动已结束</p>';
      return;
    }
    if (this._notOnline(data)) {
      this.ctx.body = '<p>活动未上线</p>';
      return;
    }

    const versionInfo = this._getVersionInfo(data, versionNo);
    if (!versionInfo) {
      this.ctx.body = '<p>未找到相关活动</p>';
      return;
    }

    try {
      const versionFullInfo = await this.service.activity.getVersionDetail(
        versionInfo.id
      );
      this.ctx.body = versionFullInfo.data.resource;
    } catch (error) {
      this.app.errorLog(error);
      this.ctx.body = error;
    }
  }
}

module.exports = PageController;
