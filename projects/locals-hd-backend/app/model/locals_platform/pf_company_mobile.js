
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_company_mobile.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        