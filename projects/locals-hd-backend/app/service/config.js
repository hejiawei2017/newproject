'use strict';
const BaseSerivce = require('../core/base-service');

module.exports = class extends BaseSerivce {
  async getList(type) {
    const where = type ? { type } : {};
    try {
      const response = await this.model.Config.findAll({ where });
      return this.success(response);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async getDetail(key, type) {
    try {
      const response = await this.model.Config.findOne({
        where: { key, type },
        raw: true,
      });
      if (!response) {
        return this.errno.NOTFOUND;
      }

      try {
        const valueJSON = JSON.parse(response.value);
        response.value = valueJSON;
        return this.success(response);
      } catch (error) {
        return this.success(response);
      }
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async create(data) {
    try {
      const detail = await this.getDetail(data.key, data.type);
      if (detail.success) {
        return this.errno.EXISTS;
      }

      if (detail.errorCode === this.errno.NOTFOUND.errorCode) {
        const response = await this.model.Config.create(data);
        return this.success(response);
      }

      return detail;
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async update(key, value, type) {
    try {
      const response = await this.model.Config.findOne({
        where: { key, type },
      });

      if (!response) {
        return this.errno.NOTFOUND;
      }
      response.value = value;
      const row = await response.save();
      return this.success(row);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }
};
