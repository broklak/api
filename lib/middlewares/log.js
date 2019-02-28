'use strict';

const Log = require('../infra/logger');
const url = require('url');
const onHeaders = require('on-headers');
const onFinished = require('on-finished');

const getip = function(req) {
    return req.headers['x-forwarded-for'] ||
      req.ip ||
      req._remoteAddress ||
      (req.connection && req.connection.remoteAddress) ||
      undefined;
  };
  
  function recordStart() {
    this._startAt = process.hrtime();
    this._startTime = new Date();
  }

function requestLogger(req, res, next) {

    req._startAt       = undefined;
    req._startTime     = undefined;
    req._remoteAddress = getip(req);
  
    res._startAt       = undefined;
    res._startTime     = undefined;
  
  
    recordStart.call(req);
    onHeaders(res, recordStart);
    onFinished(res, () => {
      const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
        (res._startAt[1] - req._startAt[1]) * 1e-6;
      const reqUrl = url.parse(req.url);
      const responseTime = ms.toFixed(3);
      const logObject = {
        req: req,
        res: res,
        responseTime: responseTime
      };
  
      Log.h(logObject, `${req._remoteAddress} - ${req.method} ${reqUrl.pathname} ${res.statusCode} ${responseTime} ms`);
    });
  
    next();
  }

  module.exports = {
    requestLogger: requestLogger
  };