'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_configs',
      {
        id: { type: s.INTEGER(11), primaryKey: true, autoIncrement: true },
        key: { type: s.STRING(32) },
        value: { type: s.STRING(32) },
        type: { type: s.STRING(32) },
        describe: { type: s.STRING(128) },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
      }
    );
    await q.addIndex('t_configs', ['key', 'type'], {
      indicesType: 'UNIQUE',
    });
  },
};
