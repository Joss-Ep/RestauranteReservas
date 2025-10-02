const { query } = require('../db');
const { ok, fail } = require('../utils/responses');
const { v4: uuidv4 } = require('uuid');

const overlapsQuery = `
  SELECT 1
  FROM reservations r
  WHERE r.table_id = $1
    AND r.status IN ('pending','confirmed','seated')
    AND r.reserved_at < ($2::timestamptz + ($3 || ' minutes')::interval)
    AND $2::timestamptz < (r.reserved_at + (r.duration_minutes || ' minutes')::interval)
  LIMIT 1
`;

const createReservation = async (req, res) => {
  const { client_id, branch_id, table_id, reserved_at, duration_minutes, guests, notes } = req.body;

  const table = await query(
    `SELECT t.id, t.capacity, t.status, b.open_time, b.close_time
     FROM restaurant_tables t
     JOIN branches b ON b.id = t.branch_id
     WHERE t.id = $1 AND t.branch_id = $2`,
    [table_id, branch_id]
  );
  const t = table.rows[0];
  if (!t) return fail(res, 'Mesa o sucursal inválida', 400);
  if (t.status !== 'available') return fail(res, 'Mesa no disponible', 400);
  if (guests > t.capacity) return fail(res, 'Capacidad excedida', 400);

  const start = new Date(reserved_at);
  if (isNaN(start.getTime())) return fail(res, 'Fecha inválida', 400);
  const hh = start.getUTCHours().toString().padStart(2, '0'); // simplificación
  const mm = start.getUTCMinutes().toString().padStart(2, '0');
  const hhmm = `${hh}:${mm}`;
  if (hhmm < t.open_time || hhmm > t.close_time) {
    return fail(res, 'Fuera del horario de atención', 400);
  }

  const conflict = await query(overlapsQuery, [table_id, reserved_at, duration_minutes]);
  if (conflict.rowCount > 0) return fail(res, 'Conflicto: ya existe reserva en ese horario', 409);

  const id = uuidv4();
  await query(
    `INSERT INTO reservations (id, client_id, branch_id, table_id, status, reserved_at, duration_minutes, guests, notes)
     VALUES ($1,$2,$3,$4,'pending',$5,$6,$7,$8)`,
    [id, client_id, branch_id, table_id, reserved_at, duration_minutes, guests, notes || null]
  );

  return ok(res, { id, status: 'pending' }, 201);
};

const listReservations = async (req, res) => {
  const { branch_id, table_id, status, from, to } = req.query;
  const conditions = [];
  const params = [];
  if (branch_id) { params.push(branch_id); conditions.push(`branch_id=$${params.length}`); }
  if (table_id)  { params.push(table_id); conditions.push(`table_id=$${params.length}`); }
  if (status)    { params.push(status); conditions.push(`status=$${params.length}`); }
  if (from)      { params.push(from); conditions.push(`reserved_at >= $${params.length}`); }
  if (to)        { params.push(to); conditions.push(`reserved_at <= $${params.length}`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT * FROM reservations ${where} ORDER BY reserved_at DESC`,
    params
  );
  return ok(res, rows);
};

const updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const valid = ['pending','confirmed','seated','completed','cancelled','no_show'];
  if (!valid.includes(status)) return fail(res, 'Estado inválido', 400);

  const result = await query(`UPDATE reservations SET status=$2 WHERE id=$1`, [id, status]);
  if (result.rowCount === 0) return fail(res, 'Reserva no encontrada', 404);

  const r = await query(`SELECT client_id FROM reservations WHERE id=$1`, [id]);
  const clientId = r.rows[0]?.client_id;
  if (clientId) {
    await query(
      `INSERT INTO notifications (id, user_id, type, title, body)
       VALUES (gen_random_uuid(), $1, 'reservation', 'Estado de reserva', $2)`,
      [clientId, `Tu reserva ${id} cambió a: ${status}`]
    );
  }

  return ok(res, { id, status });
};

module.exports = { createReservation, listReservations, updateReservationStatus };
