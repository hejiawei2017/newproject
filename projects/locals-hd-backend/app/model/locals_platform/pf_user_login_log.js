
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_user_login_log.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        