import { Router} from 'express'
import { crearComentario,getComentarios } from '../controllers/comentario.controller.js'
import {verifyToken} from '../middlewares/verifyToken.js' // Verificar el token JWT
import { validateSchemaComentarios } from '../middlewares/validateComentarios.js' // Validar el esquema del comentario
import { checkPublicacionExists } from '../middlewares/checkPublicacion.js' // Verificar que la publicación existe
import { validateUUID } from '../middlewares/validateUUID.js' // Validar que el ID de la publicación es un UUID válido
import asyncMiddleware from '../utils/asyncMiddlewareWrapper.js';

const routerComentario = Router()

// Crear un nuevo comentario en una publicación (requiere token)
routerComentario.post('/:id/comentarios', 
    validateUUID, 
    checkPublicacionExists(false), 
    verifyToken, 
    validateSchemaComentarios, 
    asyncMiddleware(crearComentario)
)

// Obtener comentarios de una publicación por ID
routerComentario.get('/:id/comentarios', 
    validateUUID, 
    checkPublicacionExists(false),
    asyncMiddleware(getComentarios)
)
    
export default routerComentario
