'use strict';

const BaseController = require('../../core/base-controller');

class VersionsController extends BaseController {
  /**
   * 创建新版本
   * @param { string } activity_id 活动ID
   * @param { string } version 活动版本
   * @param { string } resource 活动 HTML 资源
   * @param { string } [desc=''] 版本描述
   * @param { boolean } [show=true] 是否显示该版本
   * @param { boolean } [online=true] 是否设为线上版本
   *
   * @memberof VersionsController
   */
  async create() {
    const { ctx, service } = this;

    const body = ctx.filter({
      activity_id: 'string',
      version: 'string',
      resource: 'string',
      show: { type: 'boolean', default: true },
      online: { type: 'boolean', default: true },
      desc: { type: 'string', default: new Date().toLocaleString() },
    });

    ctx.response.auto(await service.activity.addVersion(body));
  }

  /**
   * 更新版本
   * @param { string } id 版本 ID
   * @param { string } desc 版本描述
   * @param { boolean } show 是否显示版本
   * @param { boolean } online 是否设为线上版本
   *
   * @memberof VersionsController
   */
  async update() {
    const { ctx, service } = this;
    const body = this.filter({
      desc: { type: 'string' },
      show: { type: 'boolean' },
      online: { type: 'boolean' },
    });

    ctx.response.auto(await service.activity.updateVersion(body));
  }
}

module.exports = VersionsController;
