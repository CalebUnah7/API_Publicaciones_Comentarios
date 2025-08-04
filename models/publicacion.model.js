import pool from '../config/db.js'

export const getAllPublicaciones = async(limit=10, offset=0) =>{
    const [rows] = await pool.query(
       ' select * from publicaciones order by fecha_creacion desc limit ? offset ?',
       [limit, offset]
    )
    return rows
}

export const getPublicacionesById = async (id) =>{
    const [rows ] = await pool.query(
        'Select * from publicaciones where id=?',
        [id]
    )
    return rows
}