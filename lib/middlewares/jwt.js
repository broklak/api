'use strict';

const jwt = require('jsonwebtoken');
const Response = require('../shared/custom-response');
const { getToken } = require('../shared/jwt-helper');

const Key = require('../shared/key');

// load public key
const publicKey = Key.getKeySync('../../config/app.rsa.pub');

// set jwt verify options
const jwtVerifyOptions = {
    algorithms: ['RS256'],
    audience: process.env.JWT_AUD_KEY,
    issuer: 'piyelek.github.io',
    clockTolerance: 5
};

module.exports = () => (req, res, next) => {
    const token = getToken(req.headers);

    if (!token) return Response.set(res, Response.statusUnauthorized);

    jwt.verify(token, publicKey, jwtVerifyOptions, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return Response.set(res, Response.statusExpiredToken);
            }

            return Response.set(res, Response.statusUnauthorized);
        }

        const userId = decoded.sub;

        req.userId = userId;

        return next();
    });
};