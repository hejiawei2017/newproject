
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_role.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        