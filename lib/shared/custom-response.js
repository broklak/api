'use strict';

const statusOK = {
  code: 200,
  message: 'OK'
};

const statusCreateOK = {
  code: 201,
  message: 'OK'
};

const statusNotFound = {
  code: 404,
  message: 'Data not Found'
};

const statusBadRequest = {
  code: 400,
  message: 'Bad Request'
};

const statusUnauthorized = {
  code: 401,
  message: 'Unauthorized'
};

const statusExpiredToken = {
  code: 403,
  message: 'Expired Token'
};

const set = (res, type, additional = {}) => res
  .status(type.code)
  .json({
    message: type.message,
    ...additional
  });


module.exports = {
  set,
  statusOK,
  statusCreateOK,
  statusNotFound,
  statusBadRequest,
  statusUnauthorized,
  statusExpiredToken,
};