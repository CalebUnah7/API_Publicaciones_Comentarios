import pool from '../config/db.js'

// Obtener todas las publicaciones activas con paginación
export const getAllPublicaciones = async(limit=10, offset=0) =>{
    const query = `
        SELECT * FROM publicaciones WHERE activo = true 
        ORDER BY fecha_creacion desc limit ? offset ?;
    `
    const [rows] = await pool.query(query, [limit, offset])
    return rows
}

// Obtener una publicación por su ID (solo si está activa)
export const getPublicacionesById = async (id) =>{
    const query = `
            SELECT * FROM publicaciones WHERE id = ? AND activo = true;
        `
    const [ rows ] = await pool.query(query, [id]);   
    return rows
}

// Crear una nueva publicación
export const postPublicacion = async (id, titulo, contenido, autorId) =>{
    const query = `
        INSERT INTO publicaciones (id, titulo, contenido, autorID)
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
            UPDATE publicaciones SET titulo = ?, contenido = ? WHERE id = ?;
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