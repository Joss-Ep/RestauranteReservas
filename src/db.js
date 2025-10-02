const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.pgssl ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('PG Pool error:', err);
});

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
