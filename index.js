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

const db = new Database(dbConfig);
db.connection.authenticate()
.then(() => {
    Log.i('Connection has been established successfully.');
})
.catch(err => {
    Log.e('Unable to connect to the database:');
    process.exit(1);
});

db.connection.sync({ force: true })
.then(() => {
      Log.i(`Database & tables created!`);
});

const privateKEY = Key.getKeySync('../../config/app.rsa');
const jwtOptions = {
    issuer: "piyelek.github.io",
    audience: "111", // this should be provided by client
    expired: process.env.ACCESS_TOKEN_EXPIRED
};

const userModel = UserModel(db.connection, Sequelize);
const userHandler = UserHandler(userModel, privateKEY, jwtOptions);

const handlers = {
    userHandler: userHandler
};

const server = new Server(handlers);

server.app.listen(PORT, err => {
    if (err) {
        Log.e(`error on startup ${err}`);
    } else {
        Log.i(`server running on port ${PORT}`);
    }
});