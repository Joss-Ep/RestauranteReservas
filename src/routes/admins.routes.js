const express = require('express');
const { createAdminValidator } = require('../validators/users.validators');
const { handleValidation } = require('../validators/common');
const { createAdmin, listAdmins } = require('../controllers/admins.controller');
const { authRequired, superAdminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', authRequired, superAdminOnly, createAdminValidator, handleValidation, createAdmin);
router.get('/', authRequired, superAdminOnly, listAdmins);

module.exports = router;
