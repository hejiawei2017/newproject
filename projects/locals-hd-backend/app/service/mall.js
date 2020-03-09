'use strict';
const BaseSerivce = require('../core/base-service');

const makeData = (data, offset, pageNum) => {
  const res = {};
  res.current = offset;
  res.list = data.rows;
  res.pageNum = offset;
  res.size = data.rows.length;
  res.total = data.count;
  res.pages = Math.ceil(res.total / pageNum);
  res.hasNextPage = (function() {
    return (res.current < res.pages);
  })();
  return res;
};

module.exports = class extends BaseSerivce {
  get model() {
    return this.app.model_mall;
  }

  async getTrade(params) {
    const { Op } = this.app.Sequelize;

    const where = {};

    if (params.user_mobile) {
      where.user_mobile = params.user_mobile;
    }
    if (params.user_real_name) {
      where.user_real_name = { [Op.like]: `%${params.user_real_name}%` };
    }
    if (params.start_time) {
      where.create_time = Object.assign({}, where.create_time, { [Op.gte]: new Date(params.start_time) });
    }
    if (params.end_time) {
      where.create_time = Object.assign({}, where.create_time, { [Op.lte]: new Date(params.end_time) });
    }

    try {
      const result = await this.model.MallTrade.findAndCountAll({
        offset: (params.page - 1) * params.pageNum,
        limit: params.pageNum,
        where,
      });

      return this.success(makeData(result, params.page, params.pageNum));
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }
};
