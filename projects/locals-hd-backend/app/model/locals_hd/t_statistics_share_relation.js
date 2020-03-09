
        module.exports = app => {
          return require('../../model-define/locals_hd/t_statistics_share_relation.js')(
            app.model_hd,
            app.Sequelize
          );
        };
        