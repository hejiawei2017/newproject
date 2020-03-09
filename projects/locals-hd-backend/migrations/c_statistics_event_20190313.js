'use strict';

module.exports = {
  async up(q, s) {
    // await q.createTable(
    //   't_statistics_event',
    //   {
    //     id: { type: s.INTEGER(11), primaryKey: true, autoIncrement: true },
    //     user_id: { type: s.STRING(128), allowNull: false },
    //     event: { type: s.STRING(32), allowNull: false, comment: '事件名' },
    //     share_user: { type: s.STRING(128), allowNull: true, comment: '邀请人的信息' },
    //     activity_name: { type: s.STRING(128), allowNull: true, comment: '活动名称' },
    //     desc: { type: s.STRING(128), allowNull: true },
    //     create_time: {
    //       type: s.DATE(0),
    //       defaultValue: s.fn('current_timestamp'),
    //     },
    //   },
    //   {
    //     engine: 'InnoDB',
    //     charset: 'utf8mb4',
    //   }
    // );

    // await q.addIndex('t_statistics_event', ['user_id']);
    // await q.addIndex('t_statistics_event', ['event']);
    // await q.addIndex('t_statistics_event', ['user_id', 'event']);
    // await q.addIndex('t_statistics_event', ['user_id', 'event', 'activity_name']);
  },
};
