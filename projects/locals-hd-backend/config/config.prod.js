'use strict';

module.exports = () => {
  const config = (exports = {});
  const ENV = process.env;

  // 生产环境 API 前缀
  config.BASE_API = 'http://172.18.10.86/api';

  // 设置 CORS 跨域配置

  // TODO: 用于刘雨测试
  // ctx => {
  //   const { origin } = ctx.header;
  //   if (/^\w+:\/\/[A-Za-z\.]*localhome\.cn$/.test(origin)) {
  //     return origin;
  //   }
  //   if (/^\w+:\/\/[A-Za-z\.]*github\.io$/.test(origin)) {
  //     return origin;
  //   }
  //   return 'https://localhome.cn';
  // }
  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  function datasource(database, delegate) {
    return {
      dialect: 'mysql',
      port: 3306,
      host: ENV.MYSQL_URL,
      username: ENV.MYSQL_USERNAME,
      password: ENV.MYSQL_PASSWORD,
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

  // 生产环境 SQL 配置
  config.sequelize = {
    datasources: [
      datasource('locals_hd', 'model_hd'),
      datasource('locals_platform', 'model_platform'),
      datasource('locals_mall', 'model_mall'),
      // datasource('locals_coupon', 'model_coupon'),
      // datasource('locals_booking', 'model_booking'),
      // datasource('locals_activity', 'model_activity')
      // ... 其他数据源
    ],
  };

  config.redis = {
    client: {
      host: ENV.REDIS_URL,
      port: 6379,
      password: ENV.REDIS_PASSWORD,
      db: 1,
    },
  };

  return config;
};
