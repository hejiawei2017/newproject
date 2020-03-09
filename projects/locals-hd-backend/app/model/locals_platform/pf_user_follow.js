
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_user_follow.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        