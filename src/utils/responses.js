const ok = (res, data = {}, status = 200) => res.status(status).json({ ok: true, data });
const fail = (res, message, status = 400, meta = {}) =>
  res.status(status).json({ ok: false, error: { message, ...meta } });

module.exports = { ok, fail };
