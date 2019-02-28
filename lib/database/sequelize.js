const Sequelize = require('sequelize');

let Database = function(config) {
    this.connection = new Sequelize(config.dbName, config.username, config.password, {
        host: config.host,
        dialect: 'mysql',
        port: config.port,
        operatorsAliases: false,
      
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      
    });
}

module.exports = Database;