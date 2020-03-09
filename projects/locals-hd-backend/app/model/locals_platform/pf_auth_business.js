
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_auth_business.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        