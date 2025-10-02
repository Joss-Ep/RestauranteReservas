require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  
  // Corrección: Usar || en lugar de asignación directa
  databaseUrl: process.env.DATABASE_URL || 
    'postgresql://neondb_owner:npg_6moBkiQsACY4@ep-noisy-paper-adtn3ltq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  
  pgssl: (process.env.PGSSL || 'true').toLowerCase() === 'true',
  
  // Advertencia: Usa una clave segura en producción
  jwtSecret: process.env.JWT_SECRET || 'change_me_hola_mundo', // ¡Cambiar en producción!
  
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
};

module.exports = config;
