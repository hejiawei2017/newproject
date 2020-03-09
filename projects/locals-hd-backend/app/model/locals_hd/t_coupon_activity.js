
        module.exports = app => {
          return require('../../model-define/locals_hd/t_coupon_activity.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        