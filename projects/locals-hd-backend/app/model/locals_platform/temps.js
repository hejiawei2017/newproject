
        module.exports = app => {
          return require('../../model-define/locals_platform/temps.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        