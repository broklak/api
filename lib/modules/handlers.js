'use strict';

const Pbkdf2 = require('nodejs-pbkdf2');
const Key = require('../shared/key');

const AuthHandler = require('./auth/handler');
const UserHandler = require('./user/handler');
const CollegeHandler = require('./college/handler');
const DegreeHandler = require('./degree/handler');
const MajorHandler = require('./major/handler');

const Model = require('./models');

// set jwt options
const jwtOptions = {
  issuer: "piyelek.github.io",
  audience: process.env.JWT_AUD_KEY,
  expired: process.env.ACCESS_TOKEN_EXPIRED
};

// set jwt verify options
const jwtVerifyOptions = {
  algorithms: ['RS256'],
  audience: process.env.JWT_AUD_KEY,
  issuer: 'piyelek.github.io',
  clockTolerance: 5
};

//password hasher
const config = {
  digestAlgorithm: 'sha1',
  keyLen: 64,
  saltSize: 64,
  iterations: 1000
};

const pbkdf2 = new Pbkdf2(config);

// load private key
const privateKEY = Key.getKeySync('../../config/app.rsa');
// load public key
const publicKEY = Key.getKeySync('../../config/app.rsa.pub');

const auth = AuthHandler(Model.user, privateKEY, jwtOptions, pbkdf2);
const user = UserHandler(Model.user, privateKEY, publicKEY, jwtVerifyOptions, jwtOptions, pbkdf2);
const college = CollegeHandler(Model.college, publicKEY, jwtVerifyOptions);
const degree = DegreeHandler(Model.degree, publicKEY, jwtVerifyOptions);
const major = MajorHandler(Model.major, publicKEY, jwtVerifyOptions);

module.exports = {
  user,
  auth,
  college,
  degree,
  major,
};