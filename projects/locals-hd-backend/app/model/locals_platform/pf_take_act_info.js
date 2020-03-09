
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_take_act_info.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        