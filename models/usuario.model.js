import pool from '../config/db.js';

// export const createUser = async (username, email, hashedPassword) => {
//   const [result] = await pool.query(
//     'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
//     [username, email, hashedPassword]
//   );
//   return result;
// };

export const createUser = async (id, email, handle, username, hashedPassword) => {
  const query = `
    INSERT INTO users (id, email, handle, nombre, password_hash)
    VALUES (UUID_TO_BIN(?), ?, ?, ?, ?);
  `

  const [result] = await pool.query(query, [id, email, handle, username, hashedPassword]);

  return result;
};

export const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?;'

  const [rows] = await pool.query(
    query, [email]
  );
  return rows[0]
};

export const getUserIdByHandle = async (handle) => {
  const query = `
    SELECT BIN_TO_UUID(id) AS id FROM users WHERE handle = ?;
  `
  const [rows] = await pool.query(query, [handle]);
  if (rows.length === 0) return null
  return rows[0].id
};
