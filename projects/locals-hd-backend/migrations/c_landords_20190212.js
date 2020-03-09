'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_landlords_landlords',
      {
        id: { type: s.STRING(32), primaryKey: true },
        type_id: { type: s.STRING(32) },
        state: { type: s.INTEGER(11) },
        name: { type: s.STRING(128) },
        phone: { type: s.STRING(32) },
        province: { type: s.STRING(32) },
        city: { type: s.STRING(32) },
        area: { type: s.STRING(32) },
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
    await q.addIndex('t_landlords_landlords', ['province']);
    await q.addIndex('t_landlords_landlords', ['type_id']);
  },
};
