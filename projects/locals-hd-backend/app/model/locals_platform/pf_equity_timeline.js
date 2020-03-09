
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_equity_timeline.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        