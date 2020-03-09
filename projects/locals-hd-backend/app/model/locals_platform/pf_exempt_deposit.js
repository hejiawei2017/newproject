
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_exempt_deposit.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        