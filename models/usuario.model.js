import pool from '../config/db.js'

// Registrar un nuevo usuario
export const register = async (user) => {
  const query = `
    INSERT INTO users (
      id, 
      email, 
      handle, 
      nombre, 
      password_hash, 
      must_change_password, 
      role
    )
    VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, false, ?)
  `
  const [rows] = await pool.query(query, [...user])
  return rows
}

// Obtener un usuario por su email
export async function loginUser(email) {
  const query = `
    SELECT 
      BIN_TO_UUID(id) AS id,
      email,
      handle,
      nombre,
      password_hash,
      must_change_password,
      role,
      created_at
    FROM users
    WHERE email = ?
  `
  const [rows] = await pool.query(query, [email])
  return rows[0]
}

// Obtener un usuario por su handle (@)
export async function loginUserByHandle(handle) {
  const query = `
    SELECT 
      BIN_TO_UUID(id) AS id,
      email,
      handle,
      nombre,
      password_hash,
      must_change_password,
      role,
      created_at
    FROM users
    WHERE handle = ?
  `
  const [rows] = await pool.query(query, [handle])
  return rows[0]
}

// Actualizar la contraseña de un usuario
export async function updatePassword(id, password_hash) {
  const query = `
    UPDATE users
    SET 
      password_hash = ?,
      must_change_password = 0
    WHERE id = UUID_TO_BIN(?)
  `
  const [rows] = await pool.query(query, [password_hash, id])
  return rows
}

