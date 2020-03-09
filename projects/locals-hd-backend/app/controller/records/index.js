'use strict';
const BaseController = require('../../core/base-controller');
const moment = require('moment');
module.exports = class extends BaseController {
  async index() {
    const query = this.filter(
      {
        // type category 兼荣老接口
        type: { type: 'string' },
        category: { type: 'string' },
        dataType: { type: 'string', default: 'string' },
        offset: { type: 'number', default: 0 },
        limit: { type: 'number', default: 10 },
        orderBy: { type: 'string', default: 'ASC' },
      },
      this.ctx.query
    );

    if (!query) {
      return;
    }

    const category = query.type || query.category;
    if (!category) {
      this.ctx.response.fail(this.errno.PARAMS);
      return;
    }

    const data = await this.service.record.findAll(
      category,
      query.offset,
      query.limit,
      query.orderBy,
    );
    if (!data.success) {
      this.ctx.body = data;
      return;
    }

    if (query.dataType === 'string') {
      this.ctx.body = data;
      return;
    }

    try {
      const reforctData = data.data.reduce(
        (newData, current) => [...newData, { ...current, data: JSON.parse(current.data) }],
        []
      );

      this.ctx.response.success(reforctData);
    } catch (error) {
      this.ctx.response.fail(this.errno.SERVER);
    }
  }

  async show() {
    this.ctx.response.auto(
      await this.service.record.find(
        this.ctx.query.category,
        this.ctx.params.id
      )
    );
  }

  async create() {
    // type category 兼荣老接口
    const body = this.filter({
      type: { type: 'number' },
      category: { type: 'string' },
      record_id: { type: 'string' },
      data_id: { type: 'string' },
      data: 'string',
    });

    if (!body) {
      return;
    }

    if (!body.type && !body.category) {
      this.ctx.response.fail(this.errno.PARAMS);
      return;
    }

    this.ctx.response.auto(
      await this.service.record.create(
        body.record_id || body.data_id,
        body.data,
        body.category || body.type
      )
    );
  }

  async update() {
    const body = this.filter({
      data: 'string',
      category: 'string',
    });
    if (!body) {
      return;
    }
    this.ctx.response.auto(
      await this.service.record.update(
        this.ctx.params.id,
        { data: body.data },
        body.category
      )
    );
  }

  async destroy() {
    const query = this.filter(
      {
        category: 'string',
      },
      this.ctx.query
    );
    if (!query) {
      return;
    }
    this.ctx.response.auto(
      await this.service.record.destroy(this.ctx.params.id, query.category)
    );
  }

  // 使用规则 link?category=xxx&phone=手机&name=xxx....
  async exportExcel() {
    const query = this.ctx.query;
    const category = query.category;
    const create_time = query.create_time;
    if (!category) {
      this.ctx.response.fail(this.errno.PARAMS);
      return;
    }
    delete query.category;

    const specification = Object.keys(query).reduce((specification, key) => {
      specification[key] = {
        displayName: query[key],
        headerStyle: {
          fill: { fgColor: { rgb: '27754B00' } },
          font: { color: { rgb: 'FFFFFFFF' } },
          alignment: { horizontal: 'center' },
        },
        width: 120,
      };
      return specification;
    }, {});

    const response = await this.service.record.findAll(category);
    if (!response.success) {
      this.ctx.response.fail(response);
      return;
    }

    try {
      let data = {};
      // 如果有 create_time字段 默认添加记录创建时间
      if (create_time) {
        data = response.data.map(item => (
          { ...JSON.parse(item.data), create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss') })
        );
      } else {
        data = response.data.map(item => JSON.parse(item.data));
      }
      const fileStream = this.service.excel.$export(
        specification,
        data
      );

      // TODO: 上传到 oss
      const name = `excel/${category}_${moment().format('YYYYMMDDhhmmss')}.xls`;
      this.service.excel.download(name, fileStream);
    } catch (error) {
      this.logger.error(response, error);
      this.ctx.response.fail(this.errno.SERVER);
    }
  }
};
