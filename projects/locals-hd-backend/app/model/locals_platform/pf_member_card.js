
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_member_card.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        