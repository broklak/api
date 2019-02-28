'use strict';

const Server = require('./lib/servers/server');

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

const server = new Server();

server.app.listen(PORT, err => {
    if (err) {
        console.log(`error on startup ${err}`);
    } else {
        console.log(`server running on port ${PORT}`);
    }
});