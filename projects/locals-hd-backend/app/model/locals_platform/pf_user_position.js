
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_user_position.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        