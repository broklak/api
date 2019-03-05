const Log = require('./lib/infra/logger');
const Server = require('./lib/servers/server');

// load env
require('dotenv').config();

const handlers = require('./lib/modules/handlers');

// set default PORT
const PORT = process.env.PORT || 9000;

// SERVER
// create server instance
const server = new Server(handlers);

// listen server
server.app.listen(PORT, err => {
    if (err) Log.e(`error on startup ${err}`);
    else Log.i(`server running on port ${PORT}`);
});