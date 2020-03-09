'use strict';

const BaseController = require('../../core/base-controller');

class QrcodeController extends BaseController {
  async index() {
    const { ctx, errno, app } = this;
    const query = this.filter(
      {
        name: 'string',
        phone: 'string',
      },
      ctx.query
    );
    if (!query) {
      return;
    }

    try {
      const response = await ctx.api.wechat.qrcode({
        appId: app.config.WECHAT.official.appid,
        secret: app.config.WECHAT.official.secret,
        scene: `name=${query.name}&phone=${query.phone}`,
        page: 'pages/activity/hand-in-hand-201901/register/index',
        path: 'pages/activity/hand-in-hand-201901/register/index',
      });
      ctx.body = response;
    } catch (error) {
      this.logger.error(error);
      ctx.body = errno.SERVER;
    }
  }
}

module.exports = QrcodeController;
