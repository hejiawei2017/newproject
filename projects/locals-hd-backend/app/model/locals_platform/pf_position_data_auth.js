
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_position_data_auth.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        