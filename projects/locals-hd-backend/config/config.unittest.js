'use strict';

module.exports = () => {
  const config = (exports = {});
  const ENV = process.env;

  // 生产环境 API 前缀
  config.BASE_API = 'https://dev.localhome.cn/api';

  // 设置 CORS 跨域配置
  config.cors = {
    origin: ctx => {
      const { origin } = ctx.header;
      return origin;
    },
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
