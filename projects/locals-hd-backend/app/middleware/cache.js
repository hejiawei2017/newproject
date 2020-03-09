'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const { app, response } = ctx;

    const expiresTime = 30;
    const expires = new Date();
    expires.setTime(expires.getTime() + expiresTime * 1000);
    response.set('Age', expiresTime);
    response.set('Cache-Control', `public, max-age=${expiresTime}`);
    response.set('Expires', expires.toUTCString());

    const cacheInfo = await app.sessionStore.get(ctx.href);
    const etag = `W/ ${Date.now().toString(16)}`;
    if (!cacheInfo || cacheInfo.etag !== ctx.request.get('If-None-Match')) {
      app.sessionStore.set(ctx.href, { etag });
      ctx.response.set('Last-Modified', new Date().toUTCString());
      ctx.response.set('etag', etag);
      await next();
      return;
    }
    response.status = 304;
    return;
  };
};
