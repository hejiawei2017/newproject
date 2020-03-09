
        module.exports = app => {
          return require('../../model-define/locals_hd/t_records.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        