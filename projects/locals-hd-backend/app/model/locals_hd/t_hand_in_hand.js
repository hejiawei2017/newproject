
        module.exports = app => {
          return require('../../model-define/locals_hd/t_hand_in_hand.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        