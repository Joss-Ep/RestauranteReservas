const { query } = require('../db');
const { ok } = require('../utils/responses');

const listNotifications = async (req, res) => {
  const userId = req.user.id;
  const { rows } = await query(
    `SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC`,
    [userId]
  );
  return ok(res, rows);
};

const markAsRead = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  await query(
    `UPDATE notifications SET read=true WHERE id=$1 AND user_id=$2`,
    [id, userId]
  );
  return ok(res, { id, read: true });
};

module.exports = { listNotifications, markAsRead };
