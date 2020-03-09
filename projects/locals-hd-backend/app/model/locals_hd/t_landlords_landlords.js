
        module.exports = app => {
          return require('../../model-define/locals_hd/t_landlords_landlords.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        