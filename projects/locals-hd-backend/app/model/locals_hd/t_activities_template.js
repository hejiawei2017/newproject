
module.exports = app => {
  const ActivitiesTemplate = require('../../model-define/locals_hd/t_activities_template')(
    app.model_hd,
    app.Sequelize
  );
};
