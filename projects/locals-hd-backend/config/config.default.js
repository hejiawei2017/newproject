'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  config.WECHAT = {
    official: {
      appid: 'wxdb6b6dc4977e6ef0',
      secret: '672f098c286349e6f78d1dc26f9c76d0',
    },
  };

  // 认证头字段
  config.AUTHORIZATION_TOKEN_KEY = 'locals-access-token';

  config.PLATFORM = 'ACTIVITY_ADMIN';

  // 底层 API 前缀
  config.BASE_API = 'https://dev.localhome.cn/api';

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1546937895205_3811';

  // 中间件
  config.middleware = [];

  // 关闭安全配置
  config.security = {
    csrf: false,
  };

  // 设置 CORS 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };

  config.logger = {
    disableConsoleAfterReady: false,
  };

  // 静态资源配置
  exports.static = {
    // maxAge: 31536000,
    prefix: '/',
  };

  exports.oss = {
    client: {
      region: 'oss-cn-shenzhen',
      accessKeyId: 'LTAI51rz55fhjUzU',
      accessKeySecret: 'QETpJ124TfYfP801ZA5Mco0djKvXtx',
      bucket: 'locals-house-prod', // locals-house-prod(生产)
      secure: true, // https访问
      endpoint: 'oss-cn-shenzhen.aliyuncs.com',
      timeout: '60s',
    },
  };

  function datasource(database, delegate) {
    return {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123456',
      baseDir: 'model/' + database,
      delegate,
      database,
      timezone: '+08:00',
      define: {
        freezeTableName: true,
        underscored: true,
        timestamps: false,
        charset: 'utf8mb4',
      },
    };
  }

  // SQL 配置
  config.sequelize = {
    datasources: [
      datasource('locals_hd', 'model_hd'),
      datasource('locals_platform', 'model_platform'),
      datasource('locals_mall', 'model_mall'),
      // datasource('locals_coupon', 'model_coupon'),
      // datasource('locals_booking', 'model_booking'),
      // datasource('locals_activity', 'model_activity'),
      // ... 其他数据源
    ],
  };

  config.redis = {
    client: {
      host: '127.0.0.1',
      port: 6379,
      password: '123456',
      db: '0',
    },

    namespace: {
      client: 'client/',
      server: 'server/',
    },
  };

  config.jwt = {
    secret: config.keys,
  };

  config.multipart = {
    autoFields: true,
    defaultCharset: 'utf8',
    fieldNameSize: 100,
    fieldSize: '100kb',
    fields: 100,
    fileSize: '2048mb',
    files: 100,
    fileExtensions: ['.xlsx'],
    // fileExtensions: ['.pptx', '.ppt'],
  };

  return config;
};
