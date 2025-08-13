import {Router} from 'express'
import { 
    getAll, 
    getById, 
    createPublicacion, 
    editPublicacion, 
    removePublicacion 
    
}   from '../controllers/publicacion.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js';
import { validatePublicacion } from '../middlewares/validatePublicacion.js';

const routerPublicacion = Router()

// Listar todas las publicaciones
routerPublicacion.get('/', getAll)

// Obtener una publicación por ID 
routerPublicacion.get('/:id', getById)

// Crear nueva publicación (requiere token)
routerPublicacion.post('/', verifyToken, validatePublicacion, createPublicacion)

// Editar publicación (requiere token y validación del esquema)
routerPublicacion.put('/:id', verifyToken, validatePublicacion, editPublicacion)

// Remover publicación (requiere token)
routerPublicacion.delete('/:id', verifyToken, removePublicacion)

export default routerPublicacion