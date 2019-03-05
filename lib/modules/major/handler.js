'use strict';

const express = require('express');
const router = express.Router();

const Log = require('../../infra/logger');
const jwtVerify = require('../../middlewares/jwt');

const Response = require('../../shared/custom-response');

const { validateBody, validateError } = require('../../shared/validator');

module.exports = (model, publicKEY, jwtVerifyOptions) => {

    // GET http://localhost:9000/majors
    router.get("/", jwtVerify(publicKEY, jwtVerifyOptions), async (req, res) => {
        let datas = await model.findAll();

        if (datas.length === 0) return Response.set(res, Response.statusNotFound);

        return Response.set(res, Response.statusOK, { data: datas });
    });

    // GET http://localhost:9000/majors/1
    router.get("/:id", jwtVerify(publicKEY, jwtVerifyOptions), async (req, res) => {
        const { id } = req.params;

        let data = await model.findByPk(id);

        if (!data) return Response.set(res, Response.statusNotFound);

        return Response.set(res, Response.statusOK, { data });
    });

    // POST http://localhost:9000/majors
    router.post("/", jwtVerify(publicKEY, jwtVerifyOptions), async (req, res) => {
        const body = req.body;

        // S: Validate body request
        const validate = validateBody(
            body,
            { name: 'Joi.string().required()' }
        );

        if (validate !== undefined && validate.err) res.status(Response.statusBadRequest.code).json({ message: validate.err });
        // E: Validate body request

        try {
            await model.create({ name: body.name });

            return Response.set(res, Response.statusCreateOK);
        } catch (err) {
            Log.e(err);

            return Response.set(res, Response.statusCreateOK, { error: validateError(err) });
        }
    });

    // PUT http://localhost:9000/majors/:id
    router.put("/:id", jwtVerify(publicKEY, jwtVerifyOptions), (req, res) => {
        const { id } = req.params;
        const body = req.body;

        // S: Validate body request
        const validate = validateBody(
            { name: body.name },
            { name: 'Joi.string().required()' }
        );

        if (validate !== undefined && validate.err) res.status(Response.statusBadRequest.code).json({ message: validate.err });
        // E: Validate body request

        model.findByPk(id)
            .then((data) => {
                if (!data) return Response.set(res, Response.statusNotFound);

                data.name = body.name;
                data.save();

                return Response.set(res, Response.statusCreateOK);
            })
            .catch((err) => {
                Log.e(err);

                return Response.set(res, Response.statusCreateOK, { error: validateError(err) });
            });
    });

    // DELETE http://localhost:9000/majors/:id
    router.delete("/:id", jwtVerify(publicKEY, jwtVerifyOptions), (req, res) => {
        const { id } = req.params;

        model.findByPk(id)
            .then((data) => {
                if (!data) return Response.set(res, Response.statusNotFound);

                data.destroy();

                return Response.set(res, Response.statusCreateOK);
            })
            .catch((err) => {
                Log.e(err);

                return Response.set(res, Response.statusCreateOK, { error: validateError(err) });
            });
    });

    return router;
};