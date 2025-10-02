-- Cambia estos valores antes de ejecutar
-- Inserta un superadmin inicial
-- Genera UUIDs y hash desde app o usa valores por defecto con funciones
-- Recomendación: crea usuario vía la API POST /api/admins con un superadmin existente.
-- Para bootstrapping, aquí lo hacemos manualmente:

DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_email TEXT := 'superadmin@tuapp.com';
  v_pass_hash TEXT := '$2a$10$H9G9q3l3wK4iJ7H0yH2Z0eC2J4s8H7F9a0k5x7c6r9QmY1rY3Wf7S'; -- hash de "SuperAdmin123!"
BEGIN
  INSERT INTO users (id, email, password_hash, role, full_name, phone)
  VALUES (v_user_id, v_email, v_pass_hash, 'superadmin', 'Super Admin', '+000000000');

  INSERT INTO administrators (user_id, is_super)
  VALUES (v_user_id, TRUE);
END$$;
Nota: el hash corresponde a la contraseña “SuperAdmin123!”. Cámbialo si quieres.
