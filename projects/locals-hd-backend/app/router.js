'use strict';

function group(basePath, ...grouopMiddlewares) {
  const router = this;
  const methods = 'get post resources del put patch options';

  return methods.split(' ').reduce((proxyRouter, methodName) => {
    proxyRouter[methodName] = (path = '/', ...middlewares) => {
      if (!router[methodName]) {
        console.warn('router method not found', methodName);
        return;
      }
      const fullPath = `${basePath}${path}`;
      router[methodName](fullPath, ...grouopMiddlewares, ...middlewares);
    };
    return proxyRouter;
  }, {});
}

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  router.group = group;

  {
    // CORS 转发
    const { cors, cache, analyseLotelExcel, activityPage, config, report } = controller.common;
    router.get('/v/:id', middleware.cache(), middleware.activityTrack(), activityPage.index);
    router.get('/api/cors', cors.index);

    const _group = router.group('/api/common');
    _group.get('/cors', cors.index);
    _group.get('/qrcode', controller.wechat.qrcode);
    _group.resources('/report', report);
    _group.resources('/cache', cache);
    _group.resources('/config', config);
    _group.resources('/records', controller.records.index);
    _group.get('/records_download', controller.records.index.exportExcel);
    _group.resources('/records_type', controller.records.type);

    // 单独的某个项目相关
    _group.options('/analyse_lotel_excel', analyseLotelExcel.options);
    _group.resources('/analyse_lotel_excel', analyseLotelExcel);
  }

  {
    // wechat
    const { base } = controller.wechat;
    const _group = router.group('/api/wechat');
    _group.get('/get_token', base.getOpenId);
    _group.get('/qrcode', controller.wechat.qrcode);
    _group.post('/miniprogram/send_temp_msg', base.sendTemplateMessageWithMiniprogram);
    _group.post('/invite_statisics', base.inviteStatisics);
    _group.get('/qrcodeInfo', base.qrcodeInfo);
    _group.post('/recordsFormid', base.recordsFormid);
    _group.post('/miniprogram/old_send_temp_msg', base.oldSendTemplateMessageWithMiniprogram);
  }

  {
    // 活动管理平台
    const { login, activities, versions } = controller.activityAdmin;
    const _auth = middleware.auth();
    const _group = router.group('/api/activity_admin');
    _group.post('/signin', login.signin);
    _group.post('/signout', _auth, login.signout);
    _group.resources('/activity', activities);
    _group.get('/activity/template/:id', activities.getTempalte);
    _group.post('/activity/create', activities.createActivity);
    router.get('/template-page/:id', activities.getTempaltePage);
    _group.resources('/activity_versions', versions);
  }

  {
    // 活动：申请房东
    const { landlords, type, download } = controller.landlords;
    const _group = router.group('/api/landlords');
    _group.resources('/index', landlords);
    _group.resources('/type', type);
    _group.resources('/download', download);
  }

  {
    // 活动：老拉新
    const { inviteUsers, receiveCoupons, qrcode } = controller.handInHand;
    const _auth = middleware.baseApiToken();
    const _group = router.group('/api/hand_in_hand', _auth);
    _group.get('/invite_user/:id', inviteUsers.show);
    _group.post('/receive_coupons', receiveCoupons.create);
    _group.get('/qrcode', qrcode.index);
  }

  // 新用户送红包活动
  {
    const { receiveCoupons } = controller.newUserRedpacket;
    const _auth = middleware.baseApiToken();
    const _group = router.group('/api/new_use_redpacket', _auth);
    _group.post('/index', receiveCoupons.create);
  }

  // 统计相关
  {
    const { share, event } = controller.statistics;
    const _group = router.group('/api/statistics');
    _group.post('/share', share.create);
    _group.post('/share_join', share.join);
    _group.post('/event', event.create);

    // 统计数据
    // _group.get('/data', data.index);
  }

  // 订单相关
  {
    const { modify } = controller.order;
    const _group = router.group('/api/order');
    const _auth = middleware.baseApiToken();
    _group.put('/modify_price', _auth, modify.price);
  }

  // 活动上报相关
  {
    const { report2 } = controller.common;
    const _group = router.group('/api/report');
    const _auth = middleware.auth();
    _group.resources('/index', report2);
    _group.post('/upload_code', _auth, report2.uploadHandleCode);
  }
  // 女王节活动
  {
    router.get('/queen/house_info', controller.activtyData.queen.index);
  }

  // 上传图片到oss
  {
    const { uploadImg } = controller.upload;
    const _group = router.group('/api/upload');
    _group.post('/img', uploadImg.index);
    _group.post('/urlToOss', uploadImg.urlToOss);
    _group.post('/base64ToOss', uploadImg.base64ToOss);
  }

  // 商城相关
  {
    const _group = router.group('/api/mall');
    _group.get('/trade', controller.mall.trade.index);
  }

  app.logger.info(router.stack.map(v => `${v.methods} ${v.path}`));
};
