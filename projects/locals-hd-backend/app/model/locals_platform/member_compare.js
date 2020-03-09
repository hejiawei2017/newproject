
        module.exports = app => {
          return require('../../model-define/locals_platform/member_compare.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        