
        module.exports = app => {
          return require('../../model-define/locals_hd/t_report_handler_code.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        