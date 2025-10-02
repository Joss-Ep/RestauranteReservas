const express = require('express');
const { branchCreateUpdateValidator } = require('../validators/branches.validators');
const { handleValidation } = require('../validators/common');
const { createBranch, listBranches, updateBranch, deleteBranch } = require('../controllers/branches.controller');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', authRequired, adminOnly, branchCreateUpdateValidator, handleValidation, createBranch);
router.get('/', authRequired, adminOnly, listBranches);
router.put('/:id', authRequired, adminOnly, branchCreateUpdateValidator, handleValidation, updateBranch);
router.delete('/:id', authRequired, adminOnly, deleteBranch);

module.exports = router;
