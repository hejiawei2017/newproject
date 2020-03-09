'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_record_text',
      {
        id: { type: s.INTEGER(11), primaryKey: true, autoIncrement: true },
        data_id: { type: s.STRING(32) },
        data: { type: s.TEXT },
        category: { type: s.STRING(128) },
        create_time: { type: s.DATE(0) },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
      }
    );
    await q.addIndex('t_record_text', ['data_id', 'category'], {
      indicesType: 'UNIQUE',
    });
  },
};
