import pool from '../config/db.js'

export async function CreateComentario(id,publicacion_id,user_id,comentario){
    //TODO: cambiamos la tabla comentariosPublicaciones realizar sus respectivos
    //TODO: cambios en el controlador
    const query = `INSERT INTO comentariosPublicaciones (id,publicacion_id,user_id,comentario)
                    VALUES (?,?,?,?)`
    const [rows] = await pool.query(query,[id,publicacion_id,user_id,comentario])

    return rows
}

export async function getComentariosByPublicacionId(publicacion_id){
    const query = `SELECT * FROM comentariosPublicaciones 
    WHERE publicacion_id = ? ORDER BY fecha_creacion DESC`

    const [rows] = await pool.query(query,[publicacion_id])

    return rows
}


