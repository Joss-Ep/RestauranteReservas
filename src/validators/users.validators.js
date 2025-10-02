const { body } = require('express-validator');

const createClientValidator = [
  body('full_name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('phone').optional().isString().isLength({ min: 5 }),
  body('password').isString().isLength({ min: 6 })
];

const createAdminValidator = [
  body('full_name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('phone').optional().isString().isLength({ min: 5 }),
  body('password').isString().isLength({ min: 6 }),
  body('is_super').optional().isBoolean()
];

module.exports = { createClientValidator, createAdminValidator };
