const { query } = require('../db');
const { ok, fail } = require('../utils/responses');
const { v4: uuidv4 } = require('uuid');

const createBranch = async (req, res) => {
  const { name, address, phone, open_time, close_time } = req.body;
  const id = uuidv4();
  await query(
    `INSERT INTO branches (id, name, address, phone, open_time, close_time)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, name, address, phone || null, open_time, close_time]
  );
  return ok(res, { id }, 201);
};

const listBranches = async (req, res) => {
  const { rows } = await query(`SELECT * FROM branches ORDER BY created_at DESC`);
  return ok(res, rows);
};

const updateBranch = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, open_time, close_time } = req.body;
  const result = await query(
    `UPDATE branches
     SET name=$2, address=$3, phone=$4, open_time=$5, close_time=$6
     WHERE id=$1`,
    [id, name, address, phone || null, open_time, close_time]
  );
  if (result.rowCount === 0) return fail(res, 'Sucursal no encontrada', 404);
  return ok(res, { id });
};

const deleteBranch = async (req, res) => {
  const { id } = req.params;
  const result = await query(`DELETE FROM branches WHERE id=$1`, [id]);
  if (result.rowCount === 0) return fail(res, 'Sucursal no encontrada', 404);
  return ok(res, { id });
};

module.exports = { createBranch, listBranches, updateBranch, deleteBranch };
