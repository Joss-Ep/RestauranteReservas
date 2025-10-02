-- Extensiones útiles en Neon (pgcrypto para gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client','admin','superadmin')),
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clientes
CREATE TABLE IF NOT EXISTS clients (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  preferences TEXT
);

-- Administradores
CREATE TABLE IF NOT EXISTS administrators (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_super BOOLEAN NOT NULL DEFAULT FALSE
);

-- Sucursales
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  open_time TEXT NOT NULL,  -- HH:MM
  close_time TEXT NOT NULL, -- HH:MM
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mesas
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id UUID PRIMARY KEY,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','unavailable')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reservas
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  table_id UUID NOT NULL REFERENCES restaurant_tables(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','seated','completed','cancelled','no_show')),
  reserved_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 600),
  guests INT NOT NULL CHECK (guests > 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Menú
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  available BOOLEAN NOT NULL DEFAULT TRUE,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ratings
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY,
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  table_id UUID NOT NULL REFERENCES restaurant_tables(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices recomendados
CREATE INDEX IF NOT EXISTS idx_reservations_table_time
  ON reservations (table_id, reserved_at);

CREATE INDEX IF NOT EXISTS idx_reservations_client
  ON reservations (client_id);

CREATE INDEX IF NOT EXISTS idx_tables_branch
  ON restaurant_tables (branch_id);

CREATE INDEX IF NOT EXISTS idx_menus_branch
  ON menus (branch_id);
