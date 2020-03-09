'use strict';
const uuidv4 = require('uuid/v4');

module.exports = app => {
  const { STRING, DATE, BOOLEAN } = app.Sequelize;

  const Version = app.model_hd.define('t_activities_version', {
    id: {
      type: STRING,
      primaryKey: true,
    },
    activity_id: STRING,
    version: STRING,
    resource: STRING,
    desc: STRING,
    show: BOOLEAN,
    create_time: DATE,
    delete_time: DATE,
  });

  Version.createVersion = async (versionInfo, options) => {
    const uuid = uuidv4();
    await Version.create(
      {
        ...versionInfo,
        id: uuid,
      },
      options
    );
    return uuid;
  };

  return Version;
};
