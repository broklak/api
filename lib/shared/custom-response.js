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
};