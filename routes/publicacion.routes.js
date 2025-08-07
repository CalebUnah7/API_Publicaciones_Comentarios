import {Router} from 'express'
import { getAll, getById, createPublicacion, editPublicacion, removePublicacion }   from '../controllers/publicacion.controller.js'

const routerPublicacion = Router()

routerPublicacion.get('/', getAll)
routerPublicacion.get('/:id', getById)
routerPublicacion.post('/', createPublicacion)
routerPublicacion.put('/:id', editPublicacion)
routerPublicacion.delete('/:id', removePublicacion)

export default routerPublicacion