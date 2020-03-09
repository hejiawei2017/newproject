
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_employee_move.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        