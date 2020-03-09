
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_promotion_group.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        