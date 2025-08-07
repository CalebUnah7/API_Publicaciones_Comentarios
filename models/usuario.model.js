import pool from '../config/db.js';

export async function register(user){
  const query = `INSERT INTO users (id,email,handle,nombre,password_hash,role)
                  VALUES(UUID_TO_BIN(?),?,?,?,?,?)`
  const [rows] = await pool.query(query,[user[0],user[1],user[2],user[3],user[4],user[5]])
  return rows
}

export async function loginUser(email){
  const query = `SELECCT BIN_TO_UUID(id) as id,email,nombre,password_hash,
                must_change_password,role,created_at
                FROM users WHERE email = ?`

  const [rows] = await pool.query(query,[email])

  return rows[0]
}

export async function updatePassword(id,password_hash){
  const query = `UPDATE users SET password_hash = ?,
                 must_change_password=0 WHERE id= UUID_TO_BIN(?)`

  const [rows] = await pool.query(query,[password_hash,id])

  return rows
}



/*
export const createUser = async (username, email, hashedPassword) => {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
  return result;
};

export const getUserByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0]; 
};*/
