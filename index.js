'use strict';

const Sequelize = require('sequelize');

const Log = require('./lib/infra/logger');
const Server = require('./lib/servers/server');
const Database = require('./lib/database/database');
const UserModel = require('./lib/modules/user/model/user');
const UserHandler = require('./lib/modules/user/handler/handler');
const Key = require('./lib/shared/key');

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

// create database instance
const db = new Database(dbConfig);

// check database connection
db.connection.authenticate()
.then(() => {
    Log.i('Connection has been established successfully.');
})
.catch(err => {
    Log.e('Unable to connect to the database:');
    process.exit(1);
});


// Note:
// please comment this code when running in production
db.connection.sync({ force: true })
.then(() => {
      Log.i(`Database & tables created!`);
});

// load private key
const privateKEY = Key.getKeySync('../../config/app.rsa');

// set jwt options
const jwtOptions = {
    issuer: "piyelek.github.io",
    expired: process.env.ACCESS_TOKEN_EXPIRED
};

const userModel = UserModel(db.connection, Sequelize);
const userHandler = UserHandler(userModel, privateKEY, jwtOptions);

const handlers = {
    userHandler: userHandler
};

// SERVER
// create server instance
const server = new Server(handlers);

// listen server
server.app.listen(PORT, err => {
    if (err) {
        Log.e(`error on startup ${err}`);
    } else {
        Log.i(`server running on port ${PORT}`);
    }
});