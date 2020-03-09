
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_user_open_id.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        