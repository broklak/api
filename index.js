'use strict';

const Server = require('./lib/servers/server');

// load env
require('dotenv').config();

// set default PORT
const PORT = process.env.PORT || 9000;

const server = new Server();

server.app.listen(PORT, err => {
    if (err) {
        console.log(`error on startup ${err}`);
    } else {
        console.log(`server running on port ${PORT}`);
    }
});