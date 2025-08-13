import {Router} from 'express'
import { 
    getAll, 
    getById, 
    getByQuery, 
    createPublicacion, 
    editPublicacion, 
    removePublicacion, 
    
}   from '../controllers/publicacion.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'; // Verificar el token JWT
import { validateSchemaPublicaciones } from '../middlewares/validatePublicacion.js'; // Validar el esquema de la publicación
import { checkPublicacionExists } from '../middlewares/checkPublicacion.js' // Verificar que la publicación existe
import { validateUUID } from '../middlewares/validateUUID.js' // Validar que el ID de la publicación es un UUID válido
import asyncMiddleware from '../utils/asyncMiddlewareWrapper.js';

const routerPublicacion = Router()

// Listar todas las publicaciones
routerPublicacion.get('/', asyncMiddleware(getAll))


// Buscar una publicación de acuerdo a una Query
routerPublicacion.get('/search', asyncMiddleware(getByQuery))

// Obtener una publicación por ID 
routerPublicacion.get('/:id', 
    validateUUID, 
    checkPublicacionExists(false), 
    asyncMiddleware(getById)
)

// Crear nueva publicación (requiere token)
routerPublicacion.post('/', 
    verifyToken, 
    validateSchemaPublicaciones, 
    asyncMiddleware(createPublicacion)
)

// Editar publicación (requiere token y validación del esquema)
routerPublicacion.put('/:id', 
    validateUUID, 
    checkPublicacionExists(false), 
    verifyToken, 
    validateSchemaPublicaciones, 
    asyncMiddleware(editPublicacion)
)

// Remover publicación (requiere token)
routerPublicacion.delete('/:id', 
    validateUUID, 
    checkPublicacionExists(true), // Se envía true por ser el caso de intentar remover (mensaje personalizado de ya haber sido removida antes)
    verifyToken, 
    asyncMiddleware(removePublicacion)
)

export default routerPublicacion