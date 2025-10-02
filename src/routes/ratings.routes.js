const express = require('express');
const { ratingCreateValidator } = require('../validators/ratings.validators');
const { handleValidation } = require('../validators/common');
const { createRating, listRatings } = require('../controllers/ratings.controller');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Un cliente autenticado podría enviar su rating, pero aquí dejamos abierto a autenticados.
// En producción, valida que req.user.id === client_id o que tenga rol cliente.
router.post('/', authRequired, ratingCreateValidator, handleValidation, createRating);
router.get('/', authRequired, listRatings);

module.exports = router;
