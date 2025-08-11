import pool from '../config/db.js'


//Crear un nuevo comentario
export async function createComentario(comentario){
    const query = `INSERT INTO comentariosPublicaciones (id,publicacion_id,user_id,comentario)
                    VALUES (?,?,UUID_TO_BIN(?),?)`
    const [result] = await pool.query(query,[...comentario])

    return result
}


//Obtener comentarios por ID de publicación
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

//Obtener un comentario por su ID
export async function getComentarioById(id){
    const query = `SELECT 
                    cp.id,
                    cp.comentario,
                    u.nombre AS autor_comentario,
                    cp.fecha_creacion
                    FROM comentariosPublicaciones cp
                    JOIN users u ON cp.user_id = u.id
                    WHERE cp.id = ?
                    AND cp.activo = TRUE;`

    const [rows] = await pool.query(query,[id])

    return rows[0]
}

//Eliminar un comentario (cambiar su estado a inactivo)
export async function deleteComentario(id){
    const query = `UPDATE comentariosPublicaciones
                    SET activo = FALSE
                    WHERE id = ?`

    const [rows] = await pool.query(query,[id])

    return rows
}

//Elimar todos los comentarios de una publicación (cambiar su estado a inactivo)
export async function deleteComentariosByPublicacionId(publicacion_id){
    const query = `UPDATE comentariosPublicaciones
                    SET activo = FALSE
                    WHERE publicacion_id = ?`

    const [rows] = await pool.query(query,[publicacion_id])

    return rows
}


