
        module.exports = app => {
          return require('../../model-define/locals_hd/t_configs.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        