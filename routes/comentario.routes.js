import { crearComentario,getComentarios } from '../controllers/comentario.controller.js'
import { Router} from 'express'
import {verifyToken} from '../middlewares/verifyToken.js'
import { validateComentarios } from '../middlewares/validateComentarios'

const routerComentario = Router()

routerComentario.post('/:id/comentarios',verifyToken, validateComentarios, crearComentario)
routerComentario.get('/:id/comentarios', getComentarios)
    
export default routerComentario
