'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_activities_template',
      {
        id: { type: s.INTEGER(11), primaryKey: true, autoIncrement: true },
        name: { type: s.STRING(32), allowNull: false },
        template: { type: s.TEXT },
        configData: { type: s.TEXT },
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

    // await q.addColumn('t_activities_version', ['template_id'], s.STRING(32), {
    //   after: 'delete_time',
    // });

    // await q.addColumn('t_activities_version', ['config_data'], s.JSON, {
    //   after: 'delete_time',
    // });
  },
};
