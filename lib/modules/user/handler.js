'use strict';

const express = require('express');
const router = express.Router();

const Log = require('../../infra/logger');
const jwtGen = require('../../shared/jwt_gen');
const jwtVerify = require('../../middlewares/jwt');

const Response = require('../../shared/custom-response');

const { validateBody, validateError } = require('../../shared/validator');

module.exports = (userModel, privateKEY, publicKEY, jwtVerifyOptions, jwtOptions, passwordHasher) => {

    // GET http://localhost:9000/users
    router.get("/", async (req, res, next) => {
        let users = await userModel.findAll();

        if (users.length === 0) return Response.set(res, Response.statusNotFound);

        return Response.set(res, Response.statusOK, { data: users });
    });

    // GET http://localhost:9000/users/1
    router.get("/:id", async (req, res, next) => {
        const { id } = req.params;

        let user = await userModel.findById(id);

        if (!user) return Response.set(res, Response.statusNotFound);

        return Response.set(res, Response.statusOK, { data: user });
    });

    // POST http://localhost:9000/users
    router.post("/", (req, res, next) => {
        const body = req.body;

        // S: Validate body request
        const validate = validateBody(
            body,
            {
                firstName: 'Joi.string().min(2).max(50).required()',
                lastName: 'Joi.string()',
                birthDate: 'Joi.string()',
                email: 'Joi.string().email().required()',
                password: 'Joi.string().required()'
            }
        );

        if (validate !== undefined && validate.err) res.status(Response.statusBadRequest.code).json({ message: validate.err });
        // E: Validate body request

        passwordHasher.hashPassword(body.password, async (err, hashedPassword, salt) => {
            if (err) {
                Log.e(err);
                return Response.set(res, Response.statusBadRequest, { error: err });
            }

            try {
                const user = await userModel.create({
                    firstName: body.firstName,
                    lastName: body.lastName,
                    birthDate: body.birthDate,
                    email: body.email,
                    password: hashedPassword,
                    salt: salt
                });

                return Response.set(res, Response.statusCreateOK);
            } catch (err) {
                Log.e(err);

                return Response.set(res, Response.statusCreateOK, { error: validateError(err) });
            }
        });
    });

    // GET http://localhost:9000/users/me
    // required:
    // Headers: Authorization Bearer jwt
    router.get('/me', jwtVerify(publicKEY, jwtVerifyOptions), async (req, res, next) => {
        const userId = parseInt(req.userId);

        const user = await userModel.findByPk(userId);

        if (!user) return Response.set(res, Response.statusNotFound);

        return Response.set(res, Response.statusOK, { data: user });
    });

    return router;
};