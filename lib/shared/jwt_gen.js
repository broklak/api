'use strict';

const jwt = require('jsonwebtoken');
const Key = require('../shared/key');

// load private key
const privateKEY = Key.getKeySync('../../config/app.rsa');

// set jwt options
const jwtOptions = {
    issuer: "piyelek.github.io",
    subject: '',
    audience: process.env.JWT_AUD_KEY,
    expired: process.env.ACCESS_TOKEN_EXPIRED
};

const generateJWT = (options = jwtOptions, payload) => {
    /*
    let payload = {
        data1: "Data 1",
        data2: "Data 2",
        data3: "Data 3",
        data4: "Data 4",
    };
    */
    // Token signing options
    var signOptions = {
        issuer: options.issuer,
        subject: options.subject,
        audience: options.audience,
        expiresIn: options.expired, // eg: `30d` 30 days validity
        algorithm: "RS256"
    };

    return jwt.sign(payload, privateKEY, signOptions);
};

module.exports = {
    jwtOptions,
    generateJWT,
};