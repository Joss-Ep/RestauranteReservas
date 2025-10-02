const { query } = require('../db');
const { ok, fail } = require('../utils/responses');
const { hashPassword } = require('../utils/passwords');
const { v4: uuidv4 } = require('uuid');

const createAdmin = async (req, res) => {
  const { full_name, email, phone, password, is_super = false } = req.body;

  // Evitar duplicados
  const exists = await query('SELECT 1 FROM users WHERE email = $1', [email]);
  if (exists.rowCount > 0) return fail(res, 'Email ya registrado', 400);

  const userId = uuidv4();
  const passHash = await hashPassword(password);

  await query('BEGIN');
  try {
    await query(
      `INSERT INTO users (id, email, password_hash, role, full_name, phone)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, email, passHash, is_super ? 'superadmin' : 'admin', full_name, phone || null]
    );

    await query(
      `INSERT INTO administrators (user_id, is_super)
       VALUES ($1, $2)`,
      [userId, !!is_super]
    );

    await query('COMMIT');
    return ok(res, { id: userId, email, role: is_super ? 'superadmin' : 'admin' }, 201);
  } catch (e) {
    await query('ROLLBACK');
    console.error(e);
    return fail(res, 'No se pudo crear el administrador', 500);
  }
};

const listAdmins = async (req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.email, u.full_name, u.phone, u.role, a.is_super, u.created_at
     FROM users u
     JOIN administrators a ON a.user_id = u.id
     ORDER BY u.created_at DESC`
  );
  return ok(res, rows);
};

module.exports = { createAdmin, listAdmins };
