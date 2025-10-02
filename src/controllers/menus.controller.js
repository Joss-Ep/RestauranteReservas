const { query } = require('../db');
const { ok, fail } = require('../utils/responses');
const { v4: uuidv4 } = require('uuid');

const createMenuItem = async (req, res) => {
  const { branch_id, name, description, price, available = true, category } = req.body;

  const b = await query('SELECT 1 FROM branches WHERE id=$1', [branch_id]);
  if (b.rowCount === 0) return fail(res, 'Sucursal no existe', 400);

  const id = uuidv4();
  await query(
    `INSERT INTO menus (id, branch_id, name, description, price, available, category)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [id, branch_id, name, description || null, price, available, category || null]
  );
  return ok(res, { id }, 201);
};

const listMenu = async (req, res) => {
  const { branch_id } = req.query;
  if (!branch_id) return fail(res, 'branch_id requerido', 400);
  const { rows } = await query(
    `SELECT * FROM menus WHERE branch_id=$1 ORDER BY created_at DESC`,
    [branch_id]
  );
  return ok(res, rows);
};

const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, available, category } = req.body;
  const result = await query(
    `UPDATE menus
     SET name=COALESCE($2,name),
         description=COALESCE($3,description),
         price=COALESCE($4,price),
         available=COALESCE($5,available),
         category=COALESCE($6,category)
     WHERE id=$1`,
    [id, name || null, description || null, price || null, available ?? null, category || null]
  );
  if (result.rowCount === 0) return fail(res, 'Ítem no encontrado', 404);
  return ok(res, { id });
};

const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  const result = await query(`DELETE FROM menus WHERE id=$1`, [id]);
  if (result.rowCount === 0) return fail(res, 'Ítem no encontrado', 404);
  return ok(res, { id });
};

module.exports = { createMenuItem, listMenu, updateMenuItem, deleteMenuItem };
