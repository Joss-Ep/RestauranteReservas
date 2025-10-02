const express = require('express');
const { reservationCreateValidator, reservationStatusValidator } = require('../validators/reservations.validators');
const { handleValidation } = require('../validators/common');
const { createReservation, listReservations, updateReservationStatus } = require('../controllers/reservations.controller');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', authRequired, adminOnly, reservationCreateValidator, handleValidation, createReservation);
router.get('/', authRequired, adminOnly, listReservations);
router.patch('/:id/status', authRequired, adminOnly, reservationStatusValidator, handleValidation, updateReservationStatus);

module.exports = router;
