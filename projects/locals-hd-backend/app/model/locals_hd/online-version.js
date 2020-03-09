'use strict';

module.exports = app => {
  const OnlineVersion = require('../../model-define/locals_hd/t_activities_online_version')(
    app.model_hd,
    app.Sequelize
  );

  OnlineVersion.updateOrCreate = async (onlineVersion, options) => {
    const onlineVersionInfo = await OnlineVersion.findOne({
      where: { activity_id: onlineVersion.activity_id },
    });
    if (!onlineVersionInfo) {
      await OnlineVersion.create(onlineVersion, options);
      return;
    }
    await OnlineVersion.update(
      { version_id: onlineVersion.version_id },
      { where: { activity_id: onlineVersion.activity_id } },
      options
    );
  };

  return OnlineVersion;
};
