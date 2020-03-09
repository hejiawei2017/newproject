// @https://github.com/eggjs/egg-sequelize/blob/2.x/lib/sequelizerc.js

'use strict';
const path = require('path');

module.exports = {
  config: path.resolve('./database.js'),
  'migrations-path': path.resolve('migrations'),
};
