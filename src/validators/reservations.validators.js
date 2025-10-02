const { body } = require('express-validator');

const reservationCreateValidator = [
  body('client_id').isUUID(),
  body('branch_id').isUUID(),
  body('table_id').isUUID(),
  body('reserved_at').isISO8601(),
  body('duration_minutes').isInt({ min: 15, max: 360 }),
  body('guests').isInt({ min: 1 })
];

const reservationStatusValidator = [
  body('status').isIn(['pending','confirmed','seated','completed','cancelled','no_show'])
];

module.exports = { reservationCreateValidator, reservationStatusValidator };
