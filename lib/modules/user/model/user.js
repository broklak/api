'use strict';

module.exports = (seq, type) => {
    return seq.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        firstName: {
            type: type.STRING,
            allowNull: false,
            validate: {
                max: 50,
                min: 2
            }
        },
        lastName: {
            type: type.STRING,
            allowNull: true
        },
        birthDate: {
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
        // Timestamps
        createdAt: {
            type: type.DATE,
            defaultValue: type.NOW
        },
        updatedAt: type.DATE
    });
};