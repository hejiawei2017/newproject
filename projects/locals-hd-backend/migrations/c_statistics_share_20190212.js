'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_statistics_share',
      {
        id: { type: s.INTEGER(11), primaryKey: true, autoIncrement: true },
        ticket_id: { type: s.STRING(32) },
        user_id: { type: s.STRING(128), allowNull: false },
        app_id: { type: s.STRING(32), allowNull: false },
        type: { type: s.STRING(32), allowNull: false },
        page: { type: s.STRING(128), allowNull: true },
        desc: { type: s.STRING(128), allowNull: true },
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

    await q.createTable(
      't_statistics_share_relation',
      {
        id: { type: s.INTEGER(32), primaryKey: true, autoIncrement: true },
        ticket_id: { type: s.STRING(32), allowNull: false },
        share_user_id: { type: s.STRING(128), allowNull: false },
        join_user_id: { type: s.STRING(128), allowNull: false },
        level: { type: s.INTEGER(11), allowNull: false, defaultValue: 1 },
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

    await q.addIndex('t_statistics_share', ['app_id', 'ticket_id'], {
      indicesType: 'UNIQUE',
    });

    await q.addIndex('t_statistics_share', ['user_id']);
    await q.addIndex(
      't_statistics_share_relation',
      ['ticket_id', 'share_user_id', 'join_user_id'],
      { indicesType: 'UNIQUE' }
    );
    await q.addIndex('t_statistics_share_relation', ['share_user_id']);
    await q.addIndex('t_statistics_share_relation', ['ticket_id']);
    await q.addIndex('t_statistics_share_relation', ['join_user_id']);
    await q.addIndex('t_statistics_share_relation', ['level']);
  },
};
