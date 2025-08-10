import pool from '../config/db.js'

export async function CreateComentario(id,publicacion_id,user_id,comentario){
    //TODO: cambiamos la tabla comentariosPublicaciones realizar sus respectivos
    //TODO: revisar controlador
    const query = `INSERT INTO comentariosPublicaciones (id,publicacion_id,user_id,comentario)
                    VALUES (?,?,?,?)`
    const [rows] = await pool.query(query,[id,publicacion_id,user_id,comentario])

    return rows
}

export async function getComentariosByPublicacionId(publicacion_id){
    const query = `SELECT 
                    cp.comentario,
                    u.nombre AS autor_comentario,
                    cp.fecha_creacion
                    FROM comentariosPublicaciones cp
                    JOIN users u ON cp.user_id = u.id
                    WHERE cp.publicacion_id = ?
                    AND cp.activo = TRUE
                    ORDER BY cp.fecha_creacion DESC;
`

    const [rows] = await pool.query(query,[publicacion_id])

    return rows
}


