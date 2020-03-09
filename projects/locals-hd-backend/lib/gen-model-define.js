'use strict';

const SequelizeAuto = require('sequelize-auto');
const auto = new SequelizeAuto('locals_hd', 'root', '123456', {
  host: '127.0.0.1',
  directory: './app/model-define/locals_hd',
});

auto.run(function(err) {
  if (err) throw err;
  console.log(auto.tables.length); // table list
});
