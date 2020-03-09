
        module.exports = app => {
          return require('../../model-define/locals_hd/t_invite_statisics.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        