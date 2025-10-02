const express = require('express');
const { tableCreateUpdateValidator } = require('../validators/tables.validators');
const { handleValidation } = require('../validators/common');
const { createTable, listTables, updateTable, deleteTable } = require('../controllers/tables.controller');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', authRequired, adminOnly, tableCreateUpdateValidator, handleValidation, createTable);
router.get('/', authRequired, adminOnly, listTables);
router.put('/:id', authRequired, adminOnly, handleValidation, updateTable);
router.delete('/:id', authRequired, adminOnly, deleteTable);

module.exports = router;
