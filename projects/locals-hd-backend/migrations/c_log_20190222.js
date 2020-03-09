'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_log',
      {
        id: { type: s.INTEGER(11), primaryKey: true, autoIncrement: true },
        message: { type: s.TEXT },
        type: { type: s.STRING(32), defaultValue: 'error' },
        create_time: {
          type: s.DATE(0),
          defaultValue: s.fn('current_timestamp'),
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
      }
    );
  },
};
