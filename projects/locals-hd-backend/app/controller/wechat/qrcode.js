'use strict';

module.exports = async ctx => {
  const query = ctx.filter(
    {
      scene: 'string',
      path: 'string',
    },
    ctx.query
  );
  if (!query) {
    return;
  }

  const { app } = ctx;
  try {
    const path = decodeURIComponent(query.path);
    const scene = decodeURIComponent(query.scene);
    const response = await ctx.api.wechat.qrcode({
      appId: app.config.WECHAT.official.appid,
      secret: app.config.WECHAT.official.secret,
      page: path,
      scene,
      path,
    });
    ctx.response.auto(response);
  } catch (error) {
    return ctx.response.fail(app.errno.SERVER, error);
  }
};
