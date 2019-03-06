'use strict';

const express = require('express');
const router = express.Router();

const Log = require('../../infra/logger');
const jwtVerify = require('../../middlewares/jwt');
const passwordHasher = require('../../shared/hash-password');

const Response = require('../../shared/custom-response');

const { validateBody, validateError } = require('../../shared/validator');

module.exports = (userModel) => {

    router.get("/", jwtVerify(), async (req, res) => {
        let users = await userModel.findAll();

        if (users.length === 0) return Response.set(res, Response.statusNotFound);

        return Response.set(res, Response.statusOK, { data: users });
    });

    router.get("/:id", jwtVerify(), async (req, res) => {
        const { id } = req.params;

        let user = await userModel.findById(id);

        if (!user) return Response.set(res, Response.statusNotFound);

        return Response.set(res, Response.statusOK, { data: user });
    });

    router.post("/", jwtVerify(), (req, res) => {
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

    router.get('/me', jwtVerify(), async (req, res) => {
        const userId = parseInt(req.userId);

        const user = await userModel.findByPk(userId);

        if (!user) return Response.set(res, Response.statusNotFound);

        return Response.set(res, Response.statusOK, { data: user });
    });

    return router;
};