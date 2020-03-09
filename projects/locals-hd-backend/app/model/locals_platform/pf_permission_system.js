
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_permission_system.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        