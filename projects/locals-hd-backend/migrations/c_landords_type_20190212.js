'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_landlords_type',
      {
        id: { type: s.STRING(32), primaryKey: true },
        name: { type: s.STRING(128) },
        need_address: { type: s.BOOLEAN, defaultValue: 1 },
        create_time: {
          type: s.DATE(0),
          defaultValue: s.fn('current_timestamp'),
        },
      },
      { engine: 'InnoDB', charset: 'utf8mb4' }
    );
    await q.addIndex('t_landlords_landlords', ['name']);
  },
};
