import {Router} from 'express'
import { 
    getAll, 
    getById, 
    createPublicacion, 
    editPublicacion, 
    removePublicacion 
    
}   from '../controllers/publicacion.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js';

const routerPublicacion = Router()

routerPublicacion.get('/', getAll)
routerPublicacion.get('/:id', getById)
routerPublicacion.post('/', verifyToken, createPublicacion)
routerPublicacion.put('/:id', verifyToken, editPublicacion)
routerPublicacion.delete('/:id', verifyToken, removePublicacion)

export default routerPublicacion