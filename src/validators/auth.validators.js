const { body } = require('express-validator');

const loginValidator = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 })
];

module.exports = { loginValidator };
