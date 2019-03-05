'use strict';

module.exports = (seq, type) => {
    const additionalOptions = {
        underscored: true,
    };

    const objModel = {
        firstName: {
            field: 'first_name',
            type: type.STRING,
            allowNull: false
        },
        lastName: {
            field: 'last_name',
            type: type.STRING,
            allowNull: true
        },
        birthDate: {
            field: 'birth_date',
            type: type.DATE,
            allowNull: false
        },
        email: {
            type: type.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Email already exists',
            },
        },
        password: {
            type: type.STRING,
            allowNull: false
        },
        salt: {
            type: type.STRING,
            allowNull: false
        },
    };

    return seq.define('users', objModel, additionalOptions);
};