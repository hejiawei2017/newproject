'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_records_formid',
      {
        id: { type: s.INTEGER(11), primaryKey: true, autoIncrement: true },
        openid: { type: s.STRING(128) },
        formid: { type: s.STRING(128) },
        is_used: { type: s.BOOLEAN(1), defaultValue: 0 },
        create_time: {
          type: s.DATE(0),
          defaultValue: s.fn('current_timestamp'),
        },
        update_time: {
          type: s.DATE(0),
          defaultValue: s.literal('CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)'),
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
      }
    );
    await q.addIndex('t_records_formid', ['openid', 'formid'], {
      indicesType: 'UNIQUE',
    });
  },
};
