const jwt = require('jsonwebtoken');
const config = require('../config');
const { fail } = require('../utils/responses');

const authRequired = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.substring(7) : null;
  if (!token) return fail(res, 'Token requerido', 401);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload; // { id, role, email }
    return next();
  } catch (e) {
    return fail(res, 'Token inválido o expirado', 401);
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) return fail(res, 'No autenticado', 401);
  if (req.user.role === 'admin' || req.user.role === 'superadmin') return next();
  return fail(res, 'Solo administradores', 403);
};

const superAdminOnly = (req, res, next) => {
  if (!req.user) return fail(res, 'No autenticado', 401);
  if (req.user.role === 'superadmin') return next();
  return fail(res, 'Solo superadministradores', 403);
};

module.exports = { authRequired, adminOnly, superAdminOnly };
