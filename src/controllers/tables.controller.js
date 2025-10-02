const { query } = require('../db');
const { ok, fail } = require('../utils/responses');
const { v4: uuidv4 } = require('uuid');

const createTable = async (req, res) => {
  const { branch_id, name, capacity, status = 'available' } = req.body;

  // validar branch
  const b = await query('SELECT 1 FROM branches WHERE id=$1', [branch_id]);
  if (b.rowCount === 0) return fail(res, 'Sucursal no existe', 400);

  const id = uuidv4();
  await query(
    `INSERT INTO restaurant_tables (id, branch_id, name, capacity, status)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, branch_id, name, capacity, status]
  );
  return ok(res, { id }, 201);
};

const listTables = async (req, res) => {
  const { branch_id } = req.query;
  let rows;
  if (branch_id) {
    rows = (await query(
      `SELECT * FROM restaurant_tables WHERE branch_id=$1 ORDER BY created_at DESC`,
      [branch_id]
    )).rows;
  } else {
    rows = (await query(`SELECT * FROM restaurant_tables ORDER BY created_at DESC`)).rows;
  }
  return ok(res, rows);
};

const updateTable = async (req, res) => {
  const { id } = req.params;
  const { name, capacity, status } = req.body;
  const result = await query(
    `UPDATE restaurant_tables
     SET name = COALESCE($2, name),
         capacity = COALESCE($3, capacity),
         status = COALESCE($4, status)
     WHERE id = $1`,
    [id, name || null, capacity || null, status || null]
  );
  if (result.rowCount === 0) return fail(res, 'Mesa no encontrada', 404);
  return ok(res, { id });
};

const deleteTable = async (req, res) => {
  const { id } = req.params;
  const result = await query(`DELETE FROM restaurant_tables WHERE id=$1`, [id]);
  if (result.rowCount === 0) return fail(res, 'Mesa no encontrada', 404);
  return ok(res, { id });
};

module.exports = { createTable, listTables, updateTable, deleteTable };
