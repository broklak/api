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
            res.status(401).json({data: {}, message: 'authorization is empty'});
            return next();
        }

        jwt.verify(token, publicKEY, options, (err, decoded) => {
            if (err) {
                if(err.name === 'TokenExpiredError'){
                    res.status(401).json({data: {}, message: 'access token expired'});
                    return next();
                }

                res.status(401).json({data: {}, message: 'invalid authorization'});
                return next();

            }

            let userId = decoded.sub;
            req.userId = userId;
            next();
        });
    }
};