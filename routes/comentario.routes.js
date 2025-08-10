import { crearComentario,getComentarios } from '../controllers/comentario.controller.js'
import { Router} from 'express'
import {verifyToken} from '../middlewares/verifyToken.js'

const routerComentario = Router()

routerComentario.post('/:id/comentarios',verifyToken, crearComentario)
routerComentario.get('/:id/comentarios', getComentarios)
    
export default routerComentario
