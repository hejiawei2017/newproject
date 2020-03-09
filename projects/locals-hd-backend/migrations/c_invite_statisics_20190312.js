'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_invite_statisics',
      {
        id: { type: s.INTEGER(11), primaryKey: true, autoIncrement: true },
        robot_name: { type: s.STRING(32) },
        robot_id: { type: s.STRING(128) },
        create_time: {
          type: s.DATE(0),
          defaultValue: s.fn('current_timestamp'),
        },
        update_time: {
          type: s.DATE(0),
          defaultValue: s.literal('CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)'),
        },
        delete_time: { type: s.DATE(0) },
        room_name: { type: s.STRING(32) },
        room_id: { type: s.STRING(128) },
        inviter_name: { type: s.STRING(32) },
        inviter_id: { type: s.STRING(128) },
        invitee_name: { type: s.STRING(32) },
        invitee_id: { type: s.STRING(128) },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
      }
    );
    await q.addIndex('t_invite_statisics', ['inviter_id', 'invitee_id'], {
      indicesType: 'UNIQUE',
    });
  },
};
