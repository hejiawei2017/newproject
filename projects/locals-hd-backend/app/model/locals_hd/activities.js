'use strict';
const moment = require('moment');

module.exports = app => {
  const { Op } = app.Sequelize;

  const Activities = require('../../model-define/locals_hd/t_activities')(
    app.model_hd,
    app.Sequelize
  );

  const FIND_ATTRIBUTES = [
    'id',
    'name',
    'state',
    'version_id',
    'start_time',
    'end_time',
    'create_time',
    'delete_time',
  ];

  function createUUID() {
    const date = new Date();
    return moment().format('YYMMDDHHmm') + (date.getTime() % 1000);
  }

  Activities.createActivity = async (data, options) => {
    const id = createUUID();
    await Activities.create({ ...data, id, state: 0 }, options);
    return id;
  };

  Activities.findActivityById = async (id, options) => {
    return Activities.findById(id, {
      attributes: FIND_ATTRIBUTES,
      ...options,
    });
  };

  Activities.findActivities = async (offset, limit, name = '', create_time = Date.now()) => {
    return Activities.findAll({
      attributes: FIND_ATTRIBUTES,
      row: true,
      where: {
        formal: 1,
        create_time: { [Op.lte]: new Date(create_time) },
        name: { [Op.like]: `%${name}%` },
        delete_time: null,
      },
      offset,
      limit,
    });
  };

  return Activities;
};
