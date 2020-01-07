const { nodeApi } = require('../../../config/config')
module.exports = {
    // BASE_API: 'https://i.localhome.cn/api/',
    BASE_API: nodeApi,
  
    PASTER_IMAGE:
      'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/invite_friends/poster_bg.png',
  
    POSTER_STORAGE_KEY: '__poster_depend_images__',
    REGISTER_STORAGE_KEY: '__handinhand_register__',
  
    QRCODE_PREFIX: 'https://uat.localhome.cn',
  
    DEFAULT_OVERTIME: 60,

    ICONPADDING: 20  // 默认图标内边距
  };
  