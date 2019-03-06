'use strict';

const { generateJWT } = require('../../lib/shared/jwt_gen');
const Key = require('../../lib/shared/key');

test('should return valid jwt', () => {

    // set jwt options
    const jwtOptions = {
        issuer: "piyelek.github.io",
        audience: "1111",
        expired: "1m",
        subject: "001"
    };

    const token = generateJWT(jwtOptions, { "name": "piyelek" });

    expect(token).not.toBe('');

});