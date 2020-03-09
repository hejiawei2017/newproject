
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_promotion_department.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        