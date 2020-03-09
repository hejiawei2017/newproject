
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_membership_record.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        