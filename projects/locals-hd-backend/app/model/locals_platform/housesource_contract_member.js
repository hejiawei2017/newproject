
        module.exports = app => {
          return require('../../model-define/locals_platform/housesource_contract_member.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        