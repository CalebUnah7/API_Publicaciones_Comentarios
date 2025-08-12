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

routerPublicacion.get('/', getAll)
routerPublicacion.get('/:id', getById)
routerPublicacion.post('/', verifyToken, validatePublicacion, createPublicacion)
routerPublicacion.put('/:id', verifyToken, validatePublicacion, editPublicacion)
routerPublicacion.delete('/:id', verifyToken, removePublicacion)

export default routerPublicacion