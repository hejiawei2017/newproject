
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_act_log.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        