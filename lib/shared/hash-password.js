'use strict';

const Pbkdf2 = require('nodejs-pbkdf2');

//password hasher
const config = {
  digestAlgorithm: 'sha1',
  keyLen: 64,
  saltSize: 64,
  iterations: 1000
};

module.exports = new Pbkdf2(config);