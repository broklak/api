'use strict';

const Joi = require('joi');
const mapValues = require('lodash/mapValues');

const replaceQuotesWithEmptyString = str => str.replace(/"/g, '');

const validateBody = (body = {}, schema = {}) => {
  // Compiled Schema
  const rules = mapValues(schema, i => eval(i));

  // Run Validation Parameter
  const validate = Joi.validate(body, Joi.object().keys(rules), { abortEarly: false });

  // If error exists
  if (validate.error) {
    let fields = {};

    validate.error.details.map((i) => {
      const field = i.context.key;

      if (!fields[field]) {
        fields = { ...fields, ...{ [field]: [replaceQuotesWithEmptyString(i.message)] } };
      } else {
        fields[field] = [...fields[field], replaceQuotesWithEmptyString(i.message)];
      }
    });

    return { err: fields };

  }

  return undefined;
};

const validateError = (err = {}) => {
  const { errors } = err;

  return errors.map((i) => i.message);
};

module.exports = {
  validateBody,
  validateError
};