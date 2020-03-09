
        module.exports = app => {
          return require('../../model-define/locals_hd/t_record_text.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        