'use strict';

const { getNow } = require('../../shared/time-custom');

module.exports = (seq, type) => {
    const additionalOptions = {
        // underscored: true,
        paranoid: true,
        hooks: {
            beforeUpdate: (instance) => instance.updatedAt = getNow(null),
            beforeDestroy: (instance) => instance.deletedAt = getNow(null)
        }
    };

    const objModel = {
        name: {
            type: type.STRING,
            allowNull: false
        },
        url: {
            type: type.STRING,
            allowNull: false
        },
        // Timestamps
        createdAt: {
            field: 'created_at',
            type: type.DATE,
            defaultValue: type.NOW
        },
        updatedAt: {
            field: 'updated_at',
            type: type.DATE
        },
        deletedAt: {
            field: 'deleted_at',
            type: type.DATE
        }
    };

    return seq.define('directory', objModel, additionalOptions);
};