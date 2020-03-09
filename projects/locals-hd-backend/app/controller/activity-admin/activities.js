'use strict';
const BaseController = require('../../core/base-controller');

function getVersion() {
  const date = new Date();
  return `${date.getFullYear() %
    100}.${date.getMonth()}.${date.getDate()}.${date.getTime() % 10000}`;
}

class ActivitiesController extends BaseController {
  /**
   * 获取活动列表
   * @param { number } [offset=0] 数据偏移
   * @param { number } [limit=0] 一次查询数据数量
   * @param { number } [create_time=Date.now()] 查询时间以前创建的
   * @param { number } [name=''] 活动名称， 模糊查询
   * @memberof ActivitiesController
   */
  async index() {
    const { ctx, service } = this;
    const data = this.ctx.filter(
      {
        offset: { default: 0, type: 'number', convertType: 'number' },
        limit: { default: 10, type: 'number', convertType: 'number' },
        name: { default: '', type: 'string' },
      },
      ctx.request.query
    );
    if (!data) {
      return;
    }

    ctx.response.auto(await service.activity.getList(data));
  }

  /**
   * 创建活动
   * @param { string } name 活动名称
   * @param { string } start_time 活动开始时间
   * @param { string } end_time 活动结束时间
   * @param { string } [state=0] 活动状态
   * @param { string } [formal=''] 活动类型
   *
   * @memberof ActivitiesController
   */
  async create() {
    const { ctx, service, errno } = this;
    const filterBody = ctx.filter({
      name: 'string',
      start_time: 'number',
      end_time: 'number',
      state: { type: 'number', default: 0 },
      formal: { type: 'number', default: 1 },
    });

    console.log('filterBody', filterBody);

    if (!filterBody) {
      return;
    }

    if (filterBody.end_time < filterBody.start_time) {
      ctx.response.fail(errno.PARAMS, '开始时间不能大于结束时间');
      return;
    }

    ctx.response.auto(await service.activity.create(filterBody));
  }

  /**
   * 查询活动详情
   * @param { string } id 活动ID
   *
   * @memberof ActivitiesController
   */
  async show() {
    const { ctx, service } = this;
    ctx.response.auto(await service.activity.get(ctx.params.id));
  }

  /**
   * 修改活动信息
   * @param { string } id 活动ID
   * @param { string } [name=''] 活动名称
   * @param { numner } [start_time=] 活动开始时间
   * @param { number } [end_time=] 活动结束时间
   * @param { number } [state=] 活动状态
   *
   * @memberof ActivitiesController
   */
  async update() {
    const { ctx, service } = this;
    const { id } = ctx.params;

    const body = this.filter({
      name: { type: 'string' },
      start_time: { type: 'number' },
      end_time: { type: 'number' },
      state: { type: 'number' },
      version_id: { type: 'string' },
      formal: { type: 'number' },
    });
    ctx.response.auto(await service.activity.update(id, body));
  }

  /**
   * 删除活动
   * @param { string } id 活动ID
   * @memberof ActivitiesController
   */
  async destroy() {
    const { ctx, service } = this;
    ctx.response.auto(
      await service.activity.update(ctx.params.id, { delete_time: Date.now() })
    );
  }

  /**
   * 获取模板
   * @param { string } id 模板ID
   * @memberof ActivitiesController
   */
  async getTempalte() {
    const { ctx, service } = this;
    console.log(ctx.params);
    ctx.response.auto(
      await service.activity.getTemplate(ctx.params.id)
    );
  }

  /**
   * 获取模板页面
   * @param { string } id 模板ID
   * @memberof ActivitiesController
   */
  async getTempaltePage() {
    const { ctx, service, errno } = this;
    console.log(ctx.params);

    const res = await service.activity.getTemplate(ctx.params.id);

    ctx.securityOptions.xframe = {
      value: 'ALLOWALL',
    };

    if (res) {
      const temData = res.data;
      const str = temData.template.replace('#CONFIG#', temData.configData);
      ctx.body = str;

    } else {
      ctx.body = errno.NOTFOUND;
    }
  }

  /**
   * 通过模板创建活动
   * @param { string } activity_id 活动ID
   * @param { string } id 模板ID
   * @param { boolean } isOnline 在线版本
   * @param { string } config 配置信息
   * @memberof ActivitiesController
   */
  async createActivity() {
    const { ctx, service, errno } = this;

    const filterBody = ctx.filter({
      activity_id: 'number',
      id: 'number',
      isOnline: 'boolean',
      config: 'object',
    });

    console.log('filterBody', filterBody);

    if (!filterBody) {
      return;
    }

    const res = await service.activity.getTemplate(filterBody.id);

    if (res) {
      const temData = res.data;

      console.log(res);
      console.log('temData', temData);

      const html = temData.template.replace('#CONFIG#', (filterBody.config instanceof String) ? filterBody.config : JSON.stringify(filterBody.config));

      const date = new Date();
      const body = {
        activity_id: filterBody.activity_id,
        version: getVersion(),
        desc: `本次提交于: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
        online: true,
        resource: html,
      };

      const self = await service.activity.addVersion(body);

      ctx.response.auto({
        url: `/v/${body.activity_id}?v=${body.version}`,
      });

    } else {
      ctx.body = errno.NOTFOUND;
    }
  }
}

module.exports = ActivitiesController;
