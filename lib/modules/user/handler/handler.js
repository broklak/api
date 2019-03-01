'use strict';

const express = require('express');
const router = express.Router();

const Log = require('../../../infra/logger');
const jwtGen = require('../../../shared/jwt_gen');

module.exports = (userModel, privateKEY, jwtOptions) => {

    // GET http://localhost:9000/users
    router.get("/", async (req, res, next) => {
        let users = await userModel.findAll();
        res.json({data: users});
    });

    // GET http://localhost:9000/users/1
    router.get("/:id", async (req, res, next) => {
        const id = req.params.id;
        let user = await userModel.findById(id);
        res.json({data: user});
    });

    // POST http://localhost:9000/users
    router.post("/", (req, res, next) => {
        const body = req.body;
        userModel.create({
            firstName: body.firstName,
            lastName: body.lastName,
            birthDate: body.birthDate,
            email: body.email,
            password: body.password,
            salt: body.salt
        }).then(user => {
            res.json({data: user});
        }).catch(err => {
            res.status(400);
            res.json({message: err});
            next();
        });
    });

    // POST http://localhost:9000/users/login
    router.post("/login", (req, res, next) => {
        const body = req.body;
        const email = body.email;
        const password = body.password;

        userModel.findOne({ where: {email: email} }).then(user => {
            if (!user) {
                Log.e('user null');
                res.status(401);
                res.json({data: {}, message: `invalid email or password`});
                return next();
            }

            if (user.password != password) {
                Log.e('invalid username or password');
                res.status(401);
                res.json({data: {}, message: `invalid email or password`});
                return next();
            }

            const payload = {
                email: user.email
            };

            jwtOptions.subject = user.id.toString();
            
            const token = jwtGen(privateKEY, payload, jwtOptions);

            return res.json({data: `Bearer ${token}`});

        }).catch(err => {
            Log.e(err);
            res.status(401);
            res.json({message: err});
            return next();
        });
    });

    return router;
};