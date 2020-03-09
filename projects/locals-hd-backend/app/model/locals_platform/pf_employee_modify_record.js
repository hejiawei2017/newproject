
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_employee_modify_record.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        