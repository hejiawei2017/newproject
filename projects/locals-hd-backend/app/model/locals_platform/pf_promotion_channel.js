
        module.exports = app => {
          return require('../../model-define/locals_platform/pf_promotion_channel.js')(
            app.model_platform,
            app.Sequelize
          );
        };
        