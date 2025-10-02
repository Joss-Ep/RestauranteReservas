const { body } = require('express-validator');

const menuCreateUpdateValidator = [
  body('branch_id').isUUID(),
  body('name').isString().isLength({ min: 2 }),
  body('description').optional().isString(),
  body('price').isFloat({ min: 0 }),
  body('available').optional().isBoolean(),
  body('category').optional().isString()
];

module.exports = { menuCreateUpdateValidator };
