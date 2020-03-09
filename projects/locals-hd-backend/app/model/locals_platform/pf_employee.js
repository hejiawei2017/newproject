
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_employee.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        