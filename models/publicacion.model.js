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
    return rows[0]
}

// Buscar una publicación de acuerdo a una Query
export const getPublicacionByQuery = async (titulo, contenido) => {
    let query = `
        SELECT 
            p.id, 
            p.titulo, 
            p.contenido,
            BIN_TO_UUID(p.autorID) AS autorID,
            u.nombre AS autor_nombre,
            u.handle AS autor_handle,
            p.fecha_creacion
        FROM publicaciones p
        LEFT JOIN users u ON p.autorID = u.id
        WHERE p.activo = TRUE
    `;

    const params = [];

    // Manejar título si está presente
    if (titulo) {
        query += ' AND LOWER(p.titulo) COLLATE utf8mb4_general_ci LIKE ?';
        params.push(`%${titulo}%`);
    }
    
    // Manejar contenido si está presente
    if (contenido) {
        query += ' AND LOWER(p.contenido) COLLATE utf8mb4_general_ci LIKE ?';
        params.push(`%${contenido}%`);
    }

    query += ' ORDER BY p.fecha_creacion DESC;';

    const [rows] = await pool.query(query, params);
    return rows;
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
        VALUES (?, ?, ?, UUID_TO_BIN(?));
    `
    const [result] = await pool.query(query, [id, titulo, contenido, autorId])

    return result
}

// Actualizar el título y contenido de una publicación
export const putPublicacion = async (id, publicacion) =>{
    const conn = await pool.getConnection();
    try{
        conn.beginTransaction( );
        const { titulo, contenido,autorId } = publicacion
        const query = `
            UPDATE publicaciones 
            SET titulo = ?, contenido = ? WHERE id = ?  AND autorID = UUID_TO_BIN(?);
        `
        const [result] = await conn.execute(query, [titulo, contenido, id, autorId])

        conn.commit();

        return result.affectedRows > 0
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

// Desactivar una publicación (borrado)
export const deletePublicacion = async (id,autorId) =>{
    const conn = await pool.getConnection();

    try{
        conn.beginTransaction( );

        const query = `
            UPDATE publicaciones SET activo = 0 WHERE id = ? AND autorID = UUID_TO_BIN(?);
        `
        const [result] = await conn.execute(query, [id,autorId])
        conn.commit();

        return result.affectedRows > 0
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
