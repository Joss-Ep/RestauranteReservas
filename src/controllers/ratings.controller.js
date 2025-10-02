const { query } = require('../db');
const { ok, fail } = require('../utils/responses');
const { v4: uuidv4 } = require('uuid');

const createRating = async (req, res) => {
  const { reservation_id, client_id, branch_id, table_id, score, comment } = req.body;

  const r = await query(
    `SELECT id, status, client_id FROM reservations WHERE id=$1 AND branch_id=$2 AND table_id=$3`,
    [reservation_id, branch_id, table_id]
  );
  const rv = r.rows[0];
  if (!rv) return fail(res, 'Reserva no válida', 400);
  if (rv.client_id !== client_id) return fail(res, 'Cliente inválido para esta reserva', 403);
  if (rv.status !== 'completed') return fail(res, 'Solo se puede calificar reservas completadas', 400);

  const id = uuidv4();
  await query(
    `INSERT INTO ratings (id, reservation_id, client_id, branch_id, table_id, score, comment)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [id, reservation_id, client_id, branch_id, table_id, score, comment || null]
  );
  return ok(res, { id }, 201);
};

const listRatings = async (req, res) => {
  const { branch_id } = req.query;
  if (!branch_id) return fail(res, 'branch_id requerido', 400);
  const { rows } = await query(
    `SELECT * FROM ratings WHERE branch_id=$1 ORDER BY created_at DESC`,
    [branch_id]
  );
  return ok(res, rows);
};

module.exports = { createRating, listRatings };
