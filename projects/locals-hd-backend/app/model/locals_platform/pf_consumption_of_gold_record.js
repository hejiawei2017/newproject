
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_consumption_of_gold_record.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        