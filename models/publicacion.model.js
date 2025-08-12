import pool from '../config/db.js'

// Obtener todas las publicaciones activas con paginación
export const getAllPublicaciones = async (limit = 10, offset = 0) => {
    const query = `
        SELECT 
            p.id, 
            p.titulo, 
            p.contenido,
            BIN_TO_UUID(p.autorID) AS autorID,
            u.nombre AS autor_nombre,
            u.handle AS autor_handle,
            p.fecha_creacion
        FROM publicaciones p
        JOIN users u ON p.autorID = u.id
        WHERE p.activo = TRUE
        ORDER BY p.fecha_creacion DESC
        LIMIT ? OFFSET ?;
    `
    const [rows] = await pool.query(query, [limit, offset])
    return rows
}

// Obtener una publicación por ID
export const getPublicacionById = async (id) => {
    const query = `
        SELECT 
            p.id, 
            p.titulo, 
            p.contenido,
            BIN_TO_UUID(p.autorID) AS autorID,
            u.nombre AS autor_nombre,
            u.handle AS autor_handle,
            p.fecha_creacion
        FROM publicaciones p
        JOIN users u ON p.autorID = u.id
        WHERE p.id = ? AND p.activo = TRUE;
    `
    const [ rows ] = await pool.query(query, [id]);   
    return rows
}

export const getPublicacionRemovidaById = async (id) => {
    const query = `
        SELECT 
            p.id, 
            p.titulo, 
            p.contenido,
            BIN_TO_UUID(p.autorID) AS autorID,
            u.nombre AS autor_nombre,
            u.handle AS autor_handle,
            p.fecha_creacion
        FROM publicaciones p
        JOIN users u ON p.autorID = u.id
        WHERE p.id = ? AND p.activo = FALSE;
    `
    const [ rows ] = await pool.query(query, [id]);   
    return rows
}

// Crear una nueva publicación
export const postPublicacion = async (id, titulo, contenido, autorId) =>{
    const query = `
        INSERT INTO publicaciones (
            id, 
            titulo, 
            contenido, 
            autorID
        )
        VALUES ?, ?, ?, UUID_TO_BIN(?));
    `
    const [result] = await pool.query(query, [id, titulo, contenido, autorId])

    return result
}

// Actualizar el título y contenido de una publicación
export const putPublicacion = async (id, publicacion) =>{
    const conn = await pool.getConnection();
    try{
        conn.beginTransaction( );
        const { titulo, contenido } = publicacion
        const query = `
            UPDATE publicaciones 
            SET titulo = ?, contenido = ? WHERE id = ?;
        `
        await conn.execute(query, [titulo, contenido, id])

        conn.commit();

        return { id, ...publicacion };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

// Desactivar una publicación (borrado)
export const deletePublicacion = async (id) =>{
    const conn = await pool.getConnection();

    try{
        conn.beginTransaction( );

        const query = `
            UPDATE publicaciones SET activo = 0 WHERE id = ?;
        `
        await conn.execute(query, [id])
        conn.commit();

        return { id, message: 'Publicacion desactivada correctamente' };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}


//Obtener el total de publicaciones (para poder calcular las paginas)
export const getTotalPublicaciones = async ()=>{
    const query =
    `SELECT COUNT(*) AS total FROM publicaciones
    WHERE activo = TRUE`
    ;
    const [rows] = await pool.query(query)
    return rows [0].total
}