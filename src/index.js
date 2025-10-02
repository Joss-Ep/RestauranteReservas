const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const { pool } = require('./db');
const { ok } = require('./utils/responses');

// Rutas
const authRoutes = require('./routes/auth.routes');
const adminsRoutes = require('./routes/admins.routes');
const clientsRoutes = require('./routes/clients.routes');
const branchesRoutes = require('./routes/branches.routes');
const tablesRoutes = require('./routes/tables.routes');
const reservationsRoutes = require('./routes/reservations.routes');
const menusRoutes = require('./routes/menus.routes');
const ratingsRoutes = require('./routes/ratings.routes');
const notificationsRoutes = require('./routes/notifications.routes');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (config.allowedOrigins.includes('*') || config.allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error('CORS bloqueado'), false);
  }
}));

// Ruta raíz informativa
/*app.get('/', (req, res) => ok(res, {
  status: 'ok',
  name: 'restaurant-reservations-backend',
  version: '1.0.0',
  docs: 'Usa /health y /api/*'
}));*/
app.get('/', (req, res) => res.redirect(302, '/health'));

app.get('/health', (req, res) => ok(res, { status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/menus', menusRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ ok: false, error: { message: 'Error interno' } });
});

app.listen(config.port, async () => {
  try {
    await pool.query('SELECT 1');
    console.log('DB conectada');
  } catch (e) {
    console.error('Fallo conexión DB:', e.message);
  }
  console.log(`API escuchando en puerto ${config.port}`);
});
