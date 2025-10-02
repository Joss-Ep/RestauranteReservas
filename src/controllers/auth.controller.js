const jwt = require('jsonwebtoken');
const { query } = require('../db');
const { comparePassword } = require('../utils/passwords');
const { ok, fail } = require('../utils/responses');
const config = require('../config');

const login = async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await query(
    `SELECT id, email, password_hash, role, full_name, phone
     FROM users WHERE email = $1 LIMIT 1`, [email]
  );
  const user = rows[0];
  if (!user) return fail(res, 'Credenciales inválidas', 401);
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) return fail(res, 'Credenciales inválidas', 401);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return ok(res, {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      phone: user.phone
    }
  });
};

module.exports = { login };
