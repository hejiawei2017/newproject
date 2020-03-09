'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_activities',
      {
        id: { type: s.STRING(32), primaryKey: true },
        version_id: { type: s.STRING(32) },
        name: { type: s.STRING(32) },
        start_time: { type: s.DATE(0) },
        end_time: { type: s.DATE(0) },
        state: { type: s.INTEGER(3) },
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
        delete_time: { type: s.DATE(0) },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
      }
    );
    // await q.addIndex('t_activities', ['name'], {
    //   indicesType: 'UNIQUE',
    // });
    // await q.addIndex('t_activities', ['start_time']);
    // await q.addIndex('t_activities', ['end_time']);
    // await q.addIndex('t_activities', ['state']);
  },
};
