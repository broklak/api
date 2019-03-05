'use strict';

module.exports = (seq, type) => {
    const additionalOptions = {
        underscored: true,
    };

    const objModel = {
        firstName: {
            field: 'first_name',
            type: type.STRING,
            allowNull: false,
            validate: {
                max: 50,
                min: 2
            }
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
            unique: true,
            validate: {
                isEmail: true
            }
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