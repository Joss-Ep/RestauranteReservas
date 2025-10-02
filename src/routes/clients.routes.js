const express = require('express');
const { createClientValidator } = require('../validators/users.validators');
const { handleValidation } = require('../validators/common');
const { createClient, listClients } = require('../controllers/clients.controller');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', authRequired, adminOnly, createClientValidator, handleValidation, createClient);
router.get('/', authRequired, adminOnly, listClients);

module.exports = router;
