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
routerPublicacion.get('/', getAll);

// Obtener una publicación por ID (solo si existe)
routerPublicacion.get(
    '/:id',
    checkPublicacionExists(), // 404 o 410 antes de getById
    getById
);

// Crear nueva publicación (requiere token)
routerPublicacion.post(
    '/',
    verifyToken,
    createPublicacion
);

// Editar publicación (requiere token y que la publicación exista)
routerPublicacion.put(
    '/:id',
    verifyToken,
    checkPublicacionExists(), // solo 404 si no existe
    editPublicacion
);

// Remover publicación (requiere token y existe o marcó como removida)
routerPublicacion.delete(
    '/:id',
    verifyToken,
    checkPublicacionExists(true), // 410 si ya removida, 404 si no existe
    removePublicacion
);
export default routerPublicacion