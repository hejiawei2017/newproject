
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_credit_card.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        