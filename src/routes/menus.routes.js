const express = require('express');
const { menuCreateUpdateValidator } = require('../validators/menus.validators');
const { handleValidation } = require('../validators/common');
const { createMenuItem, listMenu, updateMenuItem, deleteMenuItem } = require('../controllers/menus.controller');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', authRequired, adminOnly, menuCreateUpdateValidator, handleValidation, createMenuItem);
router.get('/', authRequired, adminOnly, listMenu);
router.put('/:id', authRequired, adminOnly, handleValidation, updateMenuItem);
router.delete('/:id', authRequired, adminOnly, deleteMenuItem);

module.exports = router;
