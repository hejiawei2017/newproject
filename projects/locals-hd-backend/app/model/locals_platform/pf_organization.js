
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_organization.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        