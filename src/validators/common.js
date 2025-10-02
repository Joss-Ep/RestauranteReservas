const { validationResult } = require('express-validator');
const { fail } = require('../utils/responses');

const handleValidation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return fail(res, 'Validación fallida', 422, { details: result.array() });
  }
  next();
};

module.exports = { handleValidation };
