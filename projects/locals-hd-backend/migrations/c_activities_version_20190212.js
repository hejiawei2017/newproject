'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_activities_version',
      {
        id: { type: s.STRING(32), primaryKey: true },
        activity_id: { type: s.INTEGER(32) },
        version: { type: s.INTEGER(20) },
        resource: { type: s.TEXT },
        desc: { type: s.STRING(255) },
        show: { type: s.BOOLEAN(1), defaultValue: 1 },
        create_time: {
          type: s.DATE(0),
          defaultValue: s.fn('current_timestamp'),
        },
        delete_time: { type: s.DATE(0) },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
      }
    );
    // await q.addIndex('t_activities_version', ['activity_id']);
    // await q.addIndex('t_activities_version', ['version']);
    // await q.addIndex('t_activities_version', ['activity_id', 'version'], {
    //   indicesType: 'UNIQUE',
    // });
    // await q.addIndex('t_activities_version', ['show']);
  },
};
