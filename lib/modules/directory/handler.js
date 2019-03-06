'use strict';

const express = require('express');
const router = express.Router();

const Log = require('../../infra/logger');
const jwtVerify = require('../../middlewares/jwt');

const Response = require('../../shared/custom-response');

const { validateBody, validateError } = require('../../shared/validator');

module.exports = (model) => {

    router.get("/", jwtVerify(), async (req, res) => {
        let datas = await model.findAll();

        if (datas.length === 0) return Response.set(res, Response.statusNotFound);

        return Response.set(res, Response.statusOK, { data: datas });
    });

    router.get("/:id", jwtVerify(), async (req, res) => {
        const { id } = req.params;

        let data = await model.findByPk(id);

        if (!data) return Response.set(res, Response.statusNotFound);

        return Response.set(res, Response.statusOK, { data });
    });

    router.post("/", jwtVerify(), async (req, res) => {
        const body = req.body;

        // S: Validate body request
        const validate = validateBody(
            { name: body.name, url: body.url },
            {
                name: 'Joi.string().required()',
                url: 'Joi.string().required()',
            }
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

    router.put("/:id", jwtVerify(), (req, res) => {
        const { id } = req.params;
        const body = req.body;

        // S: Validate body request
        const validate = validateBody(
            { name: body.name, url: body.url },
            {
                name: 'Joi.string().required()',
                url: 'Joi.string().required()',
            }
        );

        if (validate !== undefined && validate.err) res.status(Response.statusBadRequest.code).json({ message: validate.err });
        // E: Validate body request

        model.findByPk(id)
            .then((data) => {
                if (!data) return Response.set(res, Response.statusNotFound);

                data.name = body.name;
                data.url = body.url;
                data.save();

                return Response.set(res, Response.statusCreateOK);
            })
            .catch((err) => {
                Log.e(err);

                return Response.set(res, Response.statusCreateOK, { error: validateError(err) });
            });
    });

    router.delete("/:id", jwtVerify(), (req, res) => {
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