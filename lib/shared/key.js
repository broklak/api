'use strict';

const path = require('path');
const fs = require('fs');

const Log = require('../infra/logger');

const getKey = (args) => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(__dirname, args);
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        Log.e('error reading private/ public keys at : %s', err);
        reject(`Unable to read file, ${err}`);
      } else {
        resolve(data);
      }
    });
  });
};

const getKeySync = (args) => {
  let filePath = path.join(__dirname, args);
  let data = fs.readFileSync(filePath, 'utf-8');
  return data;
};

// USAGE:

//   getKey('../../config/app.rsa.pub')
//   .then(publicKey => {
//     console.log(publicKey);
//   })
//   .catch(err => {
//     Log.e(err);
//   });

module.exports = {
  getKey: getKey,
  getKeySync: getKeySync
};