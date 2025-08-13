import { error } from 'console'
import HTTPCodes from "../shared/codes.js";
import { AppError } from '../utils/AppError.js';
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
        //console.log('ID del comentario:', id, publicacionId, user_id, texto)
        
        const result = await createComentario([id, publicacionId, user_id, texto])
        //console.log(result)
        
        if (!result) {
            const errData = HTTPCodes.errorBadRequest('Error al crear el comentario, verifique la información proporcionada');
            throw new AppError(errData.statusCode, errData.message);
        }

        res.status(201).json({
            message: 'Comentario creado exitosamente',
            comentario: texto,
            publicacion: req.publicacion
        })
    } catch (error) {
        if (error instanceof AppError) {
            // Se vuelve a lanzar el error para que el manejador de errores lo procese
            throw error;
        }
        //console.error('Error al crear comentario:', error)
        const errData = HTTPCodes.errorServer('Error interno del servidor al crear el comentario');
        throw new AppError(errData.statusCode, errData.message, error);
    }
}

export async function getComentarios(req, res){
    try {
        const publicacionId = req.publicacion.id

        const comentarios = await getComentariosByPublicacionId(publicacionId)
        
        if (!comentarios || comentarios.length === 0) {
            const errData = HTTPCodes.errorNotFound('No se encontraron comentarios para esta publicación');
            throw new AppError(errData.statusCode, errData.message);
        }
        
        res.status(200).json({ comentarios, publicacion: req.publicacion })
    } catch (error) {
        if (error instanceof AppError) {
            // Se vuelve a lanzar el error para que el manejador de errores lo procese
            throw error;
        }
        //console.error('Error al obtener comentarios:', error)
        const errData = HTTPCodes.errorServer('Error interno del servidor al obtener los comentarios');
        throw new AppError(errData.statusCode, errData.message, error);
    } 
}