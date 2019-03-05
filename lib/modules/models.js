'use strict';

const Sequelize = require('sequelize');
const Log = require('../infra/logger');
const Database = require('../database/database');

const UserModel = require('./user/model');
const CollegeModel = require('./college/model');
const DegreeModel = require('./degree/model');
const MajorModel = require('./major/model');

const dbConfig = {
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
};

// create database instance
const db = new Database(dbConfig);

// check database connection
db.connection.authenticate()
  .then(() => Log.i('Connection has been established successfully.'))
  .catch((err) => {
    Log.e('Unable to connect to the database:');
    process.exit(1);
  });

if (process.env.MIGRATE === 'true') {
  db.connection.sync({ force: true }).then(() => Log.i(`Database & tables created!`));
}

const user = UserModel(db.connection, Sequelize);
const college = CollegeModel(db.connection, Sequelize);
const degree = DegreeModel(db.connection, Sequelize);
const major = MajorModel(db.connection, Sequelize);

module.exports = {
  user,
  college,
  degree,
  major,
};