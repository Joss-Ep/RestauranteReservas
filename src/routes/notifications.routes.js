const express = require('express');
const { authRequired } = require('../middleware/auth');
const { listNotifications, markAsRead } = require('../controllers/notifications.controller');

const router = express.Router();

router.get('/', authRequired, listNotifications);
router.patch('/:id/read', authRequired, markAsRead);

module.exports = router;
