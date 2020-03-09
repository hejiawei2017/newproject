
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_user_export3.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        