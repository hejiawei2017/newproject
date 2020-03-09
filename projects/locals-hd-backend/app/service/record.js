'use strict';
const BaseSerivce = require('../core/base-service');
const merge = require('lodash/merge');

module.exports = class extends BaseSerivce {
  async create(dataId, data, category) {
    try {
      const data_id = dataId || this.util.id.gen();
      const row = await this.model.Records.create(
        {
          id: 0,
          data_id,
          data,
          category,
          create_time: Date.now(),
        },
        { raw: true }
      );
      return this.success(row.data);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async find(category, dataId) {
    try {
      const row = await this.model.Records.findOne({
        where: {
          category,
          data_id: dataId,
        },
      });
      if (!row) {
        return this.errno.NOTFOUND;
      }
      return this.success(row.data);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async findAll(category, offset, limit, orderBy = 'ASC') {
    try {
      const options = {
        where: category ? { category } : undefined,
        offset,
        limit: limit ? limit : undefined,
        raw: true,
        order: [['create_time', orderBy]],
      };

      const row = await this.model.Records.findAll(options);
      return this.success(row);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async update(dataId, data, category) {
    try {
      const row = await this.model.Records.update(data, {
        where: { data_id: dataId, category },
      });
      return this.success(row);
    } catch (error) {
      this.app.errorLog(error);
      return this.errno.SERVER;
    }
  }

  async createOrUpdate(dataId, data, category) {
    try {
      const dataRow = await this.find(category, dataId);
      if (dataRow.errorCode === this.errno.NOTFOUND.errorCode) {
        return this.create(dataId, data.data, category);
      }

      if (dataRow.success) {
        try {
          const originData = JSON.parse(dataRow.data);
          const currentData = JSON.parse(data.data);
          const newData = merge(originData, currentData);
          data.data = JSON.stringify(newData);
        } catch (error) {
          // 忽略
        }
        return this.update(dataId, data, category);
      }
      return dataRow;
    } catch (error) {
      this.app.errorLog(error);
      return this.errno.SERVER;
    }
  }

  async destroy(dataId, category) {
    try {
      await this.model.Records.destroy({
        where: { data_id: dataId, category },
      });
      return this.success();
    } catch (error) {
      this.app.errorLog(error);
      return this.errno.SERVER;
    }
  }
};
