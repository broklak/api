'use strict';

const requestLogger = require('../middlewares/log');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

let Server = function (handlers) {
    this.app = express();

    // set middleware
    this.app.use(requestLogger.requestLogger)
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.get('/', (req, res, next) => {
        res.send('Hello.....');
    });

    this.app.use("/users", handlers.userHandler);

    // catch 404 and forward to error handler
    this.app.use((req, res, next) => {
        res.status(404).json({data: {}, message: 'not found !!!'});
        return next();
    });
};

module.exports = Server;