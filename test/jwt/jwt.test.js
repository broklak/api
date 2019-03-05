'use strict';

const jwtGen = require('../../lib/shared/jwt_gen');
const Key = require('../../lib/shared/key');

test('should return valid jwt', () => {

    // set jwt options
    const jwtOptions = {
        issuer: "piyelek.github.io",
        audience: "1111",
        expired: "1m",
        subject: "001"
    };

    // load private key
    const privateKEY = Key.getKeySync('../../config/app.rsa');

    const token = jwtGen(privateKEY, { "name": "piyelek" }, jwtOptions);

    expect(token).not.toBe('');

});