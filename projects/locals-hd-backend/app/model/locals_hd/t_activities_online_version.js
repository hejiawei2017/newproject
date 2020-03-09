
        module.exports = app => {
          return require('../../model-define/locals_hd/t_activities_online_version.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        