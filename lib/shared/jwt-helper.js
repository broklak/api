'use strict';

const Response = require('../shared/custom-response');

const getToken = (headers) => {
  if (headers && headers.authorization) {
    let parted = headers.authorization.split(' ');

    if (parted.length === 2) {
      const scheme = parted[0];

      if (/^bearer$/i.test(scheme.toLowerCase())) {
        console.log('laper')
        const token = parted[1];

        return token;
      }
    }
  }
};

module.exports = {
  getToken,
};