const { body } = require('express-validator');

const branchCreateUpdateValidator = [
  body('name').isString().isLength({ min: 2 }),
  body('address').isString().isLength({ min: 5 }),
  body('phone').optional().isString().isLength({ min: 5 }),
  body('open_time').matches(/^\d{2}:\d{2}$/),   // "09:00"
  body('close_time').matches(/^\d{2}:\d{2}$/)
];

module.exports = { branchCreateUpdateValidator };
