import pool from '../config/db.js'

export const getAllPublicaciones = async(limit=10, offset=0) =>{
    const [rows] = await pool.query(
       `SELECT * FROM publicaciones ORDER BY fecha_creacion desc limit ? offset ?;`,
        [limit, offset]
    )
    return rows
}

export const getPublicacionesById = async (id) =>{
    const [rows ] = await pool.query(
        'Select * from publicaciones where id=?;',
        [id]
    )
    return rows
}

export const postPublicacion = async (id, titulo, contenido, autorId) =>{

    const query = `
        INSERT INTO publicaciones (id, titulo, contenido, autorID)
        VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?));
    `
    const [result] = await pool.query(query, [id, titulo, contenido, autorId])

    return result
}

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