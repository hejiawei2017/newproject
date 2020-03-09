'use strict';
const moment = require('moment');

module.exports = app => {
  const ActivityVersion = require('../../model-define/locals_hd/t_activities_version')(
    app.model_hd,
    app.Sequelize
  );

  const FIND_ATTRIBUTES = [
    'id',
    'activity_id',
    'version',
    'desc',
    'create_time',
  ];

  function createUUID() {
    const date = new Date();
    return moment().format('YYMMDDHHmm') + (date.getTime() % 1000);
  }

  ActivityVersion.createVersion = async (data, options) => {
    const id = createUUID();
    await ActivityVersion.create({ ...data, id }, options);
    return id;
  };

  ActivityVersion.findVersionById = (id, options) => {
    return ActivityVersion.findById(id, {
      attributes: FIND_ATTRIBUTES,
      ...options,
    });
  };

  ActivityVersion.findVersionsByActivityId = (activity_id, options) => {
    return ActivityVersion.findAll({
      attributes: FIND_ATTRIBUTES,
      where: { activity_id },
      row: true,
      ...options,
    });
  };

  return ActivityVersion;
};
