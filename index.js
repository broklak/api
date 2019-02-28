'use strict';

const Sequelize = require('sequelize');

const Server = require('./lib/servers/server');
const Database = require('./lib/database/database');
const UserModel = require('./lib/modules/user/model/user');
const UserHandler = require('./lib/modules/user/handler/handler');

// load env
require('dotenv').config();

// set default PORT
const PORT = process.env.PORT || 9000;

const dbConfig = {
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

const db = new Database(dbConfig);
db.connection.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

db.connection.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
  })

const userModel = UserModel(db.connection, Sequelize);
const userHandler = UserHandler(userModel);

const handlers = {
    userHandler: userHandler
};

const server = new Server(handlers);

server.app.listen(PORT, err => {
    if (err) {
        console.log(`error on startup ${err}`);
    } else {
        console.log(`server running on port ${PORT}`);
    }
});