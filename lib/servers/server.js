'use strict';

const requestLogger = require('../middlewares/log');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const Response = require('../shared/custom-response');

let Server = function (handlers) {
    this.app = express();

    // set middleware
    this.app.use(requestLogger.requestLogger)
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.get('/', (req, res, next) => Response.set(res, Response.statusOK, { message: 'Api Piyelek', version: '1.0' }));

    this.app.use("/users", handlers.userHandler);
    this.app.use("/auth", handlers.authHandler);

    // catch 404 and forward to error handler
    this.app.use((req, res, next) => {
        Response.set(res, Response.statusNotFound, { message: 'Method not Found' });
        return next();
    });
};

module.exports = Server;