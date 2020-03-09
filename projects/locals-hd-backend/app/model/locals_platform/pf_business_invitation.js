
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_business_invitation.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        