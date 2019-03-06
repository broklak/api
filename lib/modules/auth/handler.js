'use strict';

const express = require('express');
const router = express.Router();

const Log = require('../../infra/logger');
const jwtGen = require('../../shared/jwt_gen');
const passwordHasher = require('../../shared/hash-password');

const Response = require('../../shared/custom-response');

module.exports = (userModel) => {

    router.post("/", async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await userModel.findOne({ where: { email } });

            //check if user is null
            if (!user) {
                Log.e('user is not registered');
                return Response.set(res, Response.statusNotFound, { message: 'Invalid email or password' });
            }

            const isValidPassword = await passwordHasher.isValidPassword(password, user.password, user.salt);

            // check if user's password is not equal given password
            if (!isValidPassword) {
                Log.e('invalid username or password');
                return Response.set(res, Response.statusNotFound, { message: 'Invalid email or password' });
            }

            // add additional payload to jwt
            const payload = {
                email: user.email
            };

            // override options
            // set jwt subject using User's ID
            const jwtOptionsSubject = user.id.toString();

            // generate jwt
            const token = jwtGen(jwtOptionsSubject, payload);

            return Response.set(res, Response.statusOK, {
                data: {
                    token,
                }
            });
        } catch (err) {
            Log.e(err);
            return Response.set(res, Response.statusBadRequest, { error: err });
        }
    });

    return router;

};