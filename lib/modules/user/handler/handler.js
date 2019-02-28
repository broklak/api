'use strict';

const express = require('express');
const router = express.Router();

module.exports = (userModel) => {
    router.get("/", async (req, res, next) => {
        let users = await userModel.findAll();
        res.json({data: users});
    });

    router.get("/:id", async (req, res, next) => {
        const id = req.params.id;
        let user = await userModel.findById(id);
        res.json({data: user});
    });

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
        });
    });

    return router;
};