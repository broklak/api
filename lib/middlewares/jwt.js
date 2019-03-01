'use strict';

const jwt = require('jsonwebtoken');

const getToken = (headers) => {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
        return parted[1];
        }
    }
};

module.exports = (publicKEY, options) => {
    return (req, res, next) => {
        const token = getToken(req.headers);

        if (!token) {
            return res.status(401).json({data: {}, message: 'authorization is empty'});
        }

        jwt.verify(token, publicKEY, options, (err, decoded) => {
            if (err) {
                if(err.name === 'TokenExpiredError'){
                    return res.status(401).json({data: {}, message: 'access token expired'});
                }

                return res.status(401).json({data: {}, message: 'invalid authorization'});

            }

            let userId = decoded.sub;
            req.userId = userId;
            return next();
        });
    }
};