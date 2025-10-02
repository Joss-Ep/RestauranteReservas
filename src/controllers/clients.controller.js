const { query } = require('../db');
const { ok, fail } = require('../utils/responses');
const { hashPassword } = require('../utils/passwords');
const { v4: uuidv4 } = require('uuid');

const createClient = async (req, res) => {
  const { full_name, email, phone, password } = req.body;

  const exists = await query('SELECT 1 FROM users WHERE email = $1', [email]);
  if (exists.rowCount > 0) return fail(res, 'Email ya registrado', 400);

  const userId = uuidv4();
  const passHash = await hashPassword(password);

  await query('BEGIN');
  try {
    await query(
      `INSERT INTO users (id, email, password_hash, role, full_name, phone)
       VALUES ($1, $2, $3, 'client', $4, $5)`,
      [userId, email, passHash, full_name, phone || null]
    );
    await query(
      `INSERT INTO clients (user_id) VALUES ($1)`,
      [userId]
    );
    await query('COMMIT');
    return ok(res, { id: userId, email, role: 'client' }, 201);
  } catch (e) {
    await query('ROLLBACK');
    console.error(e);
    return fail(res, 'No se pudo crear el cliente', 500);
  }
};

const listClients = async (req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.email, u.full_name, u.phone, u.created_at
     FROM users u
     JOIN clients c ON c.user_id = u.id
     ORDER BY u.created_at DESC`
  );
  return ok(res, rows);
};

module.exports = { createClient, listClients };
