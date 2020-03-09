
        module.exports = app => {
          return require('../../model-define/locals_hd/t_log.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        