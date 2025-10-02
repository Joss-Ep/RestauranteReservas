const express = require('express');
const { loginValidator } = require('../validators/auth.validators');
const { handleValidation } = require('../validators/common');
const { login } = require('../controllers/auth.controller');

const router = express.Router();
router.post('/login', loginValidator, handleValidation, login);

module.exports = router;
