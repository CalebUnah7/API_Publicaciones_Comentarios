import { error } from 'console'
import { createComentario, getComentariosByPublicacionId } from '../models/comentario.model.js'
import { v4 as uuidv4 } from 'uuid'
import sanitizeHtml from 'sanitize-html'

export async function crearComentario(req, res){
    // req.publicacion contiene la publicación validada por el middleware
    const publicacionId = req.publicacion.id
    const user_id = req.user.id
    const { contenido } = req.body
    
    //hacemos la sanitización del comentario
    const texto = sanitizeHtml(contenido, {
        allowedTags: [], // No se permiten etiquetas HTML
        allowedAttributes: {} // tampoco se permiten atributos
    })

    try {
        const id = uuidv4() // generar un nuevo UUID para el comentario
        console.log('ID del comentario:', id, publicacionId, user_id, texto)
        
        const result = await createComentario([id, publicacionId, user_id, texto])
        console.log(result)
        
        if (!result) {
            return res.status(400).json({
                message: 'Error al crear el comentario'
            })
        }

        res.status(201).json({
            message: 'Comentario creado exitosamente',
            comentario: texto
        })
    } catch (error) {
        console.error('Error al crear comentario:', error)
        res.status(500).json({
            message: 'Error interno del servidor al crear el comentario'
        })
    }
}

export async function getComentarios(req, res){
    try {
        const publicacionId = req.publicacion.id

        const comentarios = await getComentariosByPublicacionId(publicacionId)
        
        if (!comentarios || comentarios.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron comentarios para esta publicación'
            })
        }

        res.status(200).json({ comentarios })
    } catch (error) {
        console.error('Error al obtener comentarios:', error)
        res.status(500).json({
            message: 'Error interno del servidor al obtener los comentarios'
        })
    } 
}