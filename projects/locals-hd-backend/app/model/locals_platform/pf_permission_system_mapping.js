
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_permission_system_mapping.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        