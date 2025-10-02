const { body } = require('express-validator');

const ratingCreateValidator = [
  body('reservation_id').isUUID(),
  body('client_id').isUUID(),
  body('branch_id').isUUID(),
  body('table_id').isUUID(),
  body('score').isInt({ min: 1, max: 5 }),
  body('comment').optional().isString()
];

module.exports = { ratingCreateValidator };
