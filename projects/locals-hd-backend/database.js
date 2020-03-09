'use strict';
const ENV = process.env;

module.exports = {
  development: {
    username: 'root',
    password: '123456',
    database: 'locals_hd',
    host: 'localhost',
    dialect: 'mysql',
  },
  production: {
    username: ENV.MYSQL_USERNAME,
    password: ENV.MYSQL_PASSWORD,
    database: 'locals_hd',
    host: ENV.MYSQL_URL,
    dialect: 'mysql',
  },
};
