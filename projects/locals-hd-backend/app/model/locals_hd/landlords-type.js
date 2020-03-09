'use strict';
const uuidv4 = require('uuid/v4');

module.exports = app => {
  const { STRING, BOOLEAN } = app.Sequelize;

  const LandlordType = app.model_hd.define('t_landlords_type', {
    id: { type: STRING, primaryKey: true },
    name: STRING,
    need_address: BOOLEAN,
  });

  LandlordType.createType = async (data, options) => {
    const uuid = uuidv4();
    await LandlordType.create(
      {
        id: uuid,
        ...data,
      },
      options
    );
    return uuid;
  };

  return LandlordType;
};
