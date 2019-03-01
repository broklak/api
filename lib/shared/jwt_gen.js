'use strict';

const jwt = require('jsonwebtoken');

const generateJWT = (privateKEY, payload, options) => {
    /*
    let payload = {
        data1: "Data 1",
        data2: "Data 2",
        data3: "Data 3",
        data4: "Data 4",
    };
     let options = {
        issuer: "piyelek.github.io",
        subject: "pyelek@user.me", 
        audience: "111", // this should be provided by client
        expired: "2m",
     }
    */
    // Token signing options
    var signOptions = {
        issuer:  options.issuer,
        subject:  options.subject,
        audience:  options.audience,
        expiresIn:  options.expired,    // eg: `30d` 30 days validity
        algorithm:  "RS256"    
    };
    return jwt.sign(payload, privateKEY, signOptions);
  };

  module.exports = generateJWT;