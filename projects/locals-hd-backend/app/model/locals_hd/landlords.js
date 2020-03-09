'use strict';
const uuidv4 = require('uuid/v4');

module.exports = app => {
  const { STRING, INTEGER, DATE, Op } = app.Sequelize;

  const Landlords = app.model_hd.define('t_landlords_landlords', {
    id: { type: STRING, primaryKey: true },
    type_id: STRING,
    state: INTEGER,
    name: STRING,
    phone: STRING,
    province: STRING,
    city: STRING,
    area: STRING,
    create_time: DATE,
    update_time: DATE,
  });

  Landlords.createLandlords = async (data, options) => {
    const uuid = uuidv4();
    await Landlords.create(
      {
        id: uuid,
        ...data,
      },
      options
    );
    return uuid;
  };

  Landlords.findLandlords = async (data, ...options) => {
    const where = {
      create_time: {
        [Op.gte]: new Date(data.start_time),
        [Op.lte]: new Date(data.end_time),
      },
    };
    if (data.type_id) {
      where.type_id = data.type_id;
    }
    return Landlords.findAll({
      where,
      row: true,
      ...options,
    });
  };

  return Landlords;
};
