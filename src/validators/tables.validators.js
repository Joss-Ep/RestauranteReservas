const { body } = require('express-validator');

const tableCreateUpdateValidator = [
  body('branch_id').isUUID(),
  body('name').isString().isLength({ min: 1 }),
  body('capacity').isInt({ min: 1 }),
  body('status').optional().isIn(['available','unavailable'])
];

module.exports = { tableCreateUpdateValidator };
