'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_report_handler_code',
      {
        id: { type: s.INTEGER(11), primaryKey: true, autoIncrement: true },
        activity_id: { type: s.STRING(36), allowNull: false },
        type: { type: s.STRING(20), defaultValue: 'index', allowNull: false },
        code: { type: s.TEXT, allowNull: false },
        create_time: {
          type: s.DATE(0),
          defaultValue: s.fn('current_timestamp'),
        },
        update_time: {
          type: s.DATE(0),
          defaultValue: s.literal(
            'CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)'
          ),
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
      }
    );
  },
};
