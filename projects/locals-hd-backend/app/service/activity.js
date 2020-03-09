'use strict';
const BaseSerivce = require('../core/base-service');

module.exports = class extends BaseSerivce {
  /**
   * 创建活动
   *
   * @param {*} data 活动属性
   */
  async create(data) {
    const { errno, model } = this;
    try {
      const activityId = await model.Activities.createActivity({
        ...data,
      });
      return this.success(activityId);
    } catch (error) {
      this.logger.error(error);
      return errno.SERVER;
    }
  }

  /**
   * 更新活动
   *
   * @param {*} id 活动ID
   * @param {*} data 活动属性
   */
  async update(id, data) {
    const { errno } = this;
    try {
      const activityInfo = await this.model.Activities.findById(id);
      if (!activityInfo) {
        errno.NOTFOUND;
        return;
      }

      await this.model.Activities.update(data, { where: { id } });
      return errno.SUCCESS;
    } catch (error) {
      return errno.SERVER;
    }
  }

  /**
   * 获取活动列表
   *
   * @param {*} { offset, limit, name } 参数
   */
  async getList({ offset, limit, name }) {
    const { errno } = this;
    try {
      const activityInfos = await this.model.Activities.findActivities(
        offset,
        limit,
        name
      );
      return this.success(activityInfos);
    } catch (error) {
      this.logger.error(error);
      return errno.SERVER;
    }
  }

  /**
   * 获取活动详情
   *
   * @param {*} activityId 活动ID
   */
  async get(activityId) {
    const { errno, app } = this;
    try {
      const activityDetail = await this.model.Activities.findById(activityId);
      if (!activityDetail) {
        return errno.NOTFOUND;
      }

      const versions = await this.model.ActivityVersion.findVersionsByActivityId(
        activityId
      );

      return this.success({
        activityDetail,
        versions: app.util.array.normalize(versions, 'id'),
      });
    } catch (error) {
      this.logger.error(error);
      return errno.SERVER;
    }
  }

  async getVersionDetail(versionId) {
    try {
      const versionDetail = await this.model.ActivityVersion.findById(versionId);
      if (!versionDetail) {
        return this.errno.NOTFOUND;
      }
      return this.success(versionDetail);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }
  /**
   * 新增版本
   *
   * @param {*} data 版本数据
   */
  async addVersion(data) {
    try {
      const versionId = this.app.util.id.new;
      await this.model.ActivityVersion.create({ ...data, id: versionId });
      if (data.online) {
        await this.update(data.activity_id, { version_id: versionId });
      }
      return this.success(versionId);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  /**
   * 更新版本信息
   *
   * @param {*} id 版本ID
   * @param {*} data 版本数据
   */
  async updateVersion(id, data) {
    const { errno } = this;
    try {
      const versionInfo = await this.model.ActivityVersion.findById(id);
      if (!versionInfo) {
        return errno.NOTFOUND;
      }

      if (data.online) {
        await this.update(versionInfo.activity_id, { version_id: id });
      }

      await this.model.ActivityVersion.update(data, { where: { id } });
      return this.errno.SUCCESS;
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  /**
   * 获取模板信息
   *
   * @param {*} id 模板ID
   */
  async getTemplate(id) {
    try {
      const result = await this.model.ActivitiesTemplate.findOne({
        where: {
          id,
        },
      });
      return this.success(result);

    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }
};
