
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_cash_vip_record.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        