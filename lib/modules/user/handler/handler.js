'use strict';

const express = require('express');
const router = express.Router();

const Log = require('../../../infra/logger');
const jwtGen = require('../../../shared/jwt_gen');
const jwtVerify = require('../../../middlewares/jwt');

module.exports = (userModel, privateKEY, publicKEY, jwtVerifyOptions, jwtOptions) => {

    // GET http://localhost:9000/users
    router.get("/", async (req, res, next) => {
        let users = await userModel.findAll();
        return res.status(200).json({data: users, message: 'get all users'});
    });

    // GET http://localhost:9000/users/1
    // router.get("/:id", async (req, res, next) => {
    //     const id = req.params.id;
    //     let user = await userModel.findById(id);
    //     if (!user) {
    //         return res.status(200).json({data: {}, message: 'user not found'});
    //     }
    //     return res.status(200).json({data: user, message: 'get user by id'});
    // });

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
            return res.status(201).json({data: user, message: 'success create user'});
        }).catch(err => {
            Log.e(err);
            res.status(400).json({data: {}, message: err});
            return next();
        });
    });

    // POST http://localhost:9000/users/login
    router.post("/login", (req, res, next) => {
        const body = req.body;
        const email = body.email;
        const password = body.password;

        userModel.findOne({ where: {email: email} }).then(user => {

            //check if user is null
            if (!user) {
                Log.e('user null');
                res.status(401).json({data: {}, message: `invalid email or password`});
                return next();
            }

            // check if user's password is not equal given password
            if (user.password != password) {
                Log.e('invalid username or password');
                res.status(401).json({data: {}, message: `invalid email or password`});
                return next();
            }

            // add additional payload to jwt
            const payload = {
                email: user.email
            };

            // override options
            // set jwt subject using User's ID
            jwtOptions.subject = user.id.toString();
            
            // generate jwt
            const token = jwtGen(privateKEY, payload, jwtOptions);

            return res.status(200).json({data: `Bearer ${token}`, message: 'login success'});

        }).catch(err => {
            Log.e(err);
            res.status(401).json({data: {}, message: err});
            return next();
        });
    });

    // GET http://localhost:9000/users/me
    router.get('/me', jwtVerify(publicKEY, jwtVerifyOptions), async (req, res, next) => {
        const userId = parseInt(req.userId);

        let user = await userModel.findById(userId);
        if (!user) {
            return res.status(200).json({data: {}, message: 'user not found'});
        }
        return res.status(200).json({data: user, message: 'get me'});
    });

    return router;
};