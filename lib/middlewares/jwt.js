'use strict';

const jwt = require('jsonwebtoken');
const Response = require('../shared/custom-response');

const getToken = (headers) => {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');

        if (parted.length === 2) return parted[1];
    }
};

module.exports = (publicKEY, options) => {
    return (req, res, next) => {
        const token = getToken(req.headers);

        if (!token) return Response.set(res, Response.statusUnauthorized);

        jwt.verify(token, publicKEY, options, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') return Response.set(res, Response.statusExpiredToken);

                return Response.set(res, Response.statusUnauthorized);
            }

            const userId = decoded.sub;

            req.userId = userId;

            return next();
        });
    }
};