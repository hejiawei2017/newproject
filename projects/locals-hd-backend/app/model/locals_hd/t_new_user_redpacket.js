
        module.exports = app => {
          return require('../../model-define/locals_hd/t_new_user_redpacket.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        