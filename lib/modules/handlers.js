'use strict';

const Model = require('./models');

const AuthHandler = require('./auth/handler');
const UserHandler = require('./user/handler');
const CollegeHandler = require('./college/handler');
const DirectoryHandler = require('./directory/handler');
const MajorHandler = require('./major/handler');

const auth = AuthHandler(Model.user);
const college = CollegeHandler(Model.college);
const directory = DirectoryHandler(Model.directory);
const major = MajorHandler(Model.major);
const user = UserHandler(Model.user);

module.exports = {
  user,
  auth,
  college,
  directory,
  major,
};