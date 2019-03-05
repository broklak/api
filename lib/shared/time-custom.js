'use strict';

const moment = require('moment');

const getNow = (format = 'YYYY-MM-DD HH:mm:ss') => moment().format();

module.exports = {
  getNow
};