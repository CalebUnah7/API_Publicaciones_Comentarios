import { crearComentario,getComentarios } from '../controllers/comentario.controller.js'
import { Router} from 'express'

const routerComentario = Router()

routerComentario.post('/:id/comentarios', crearComentario)
routerComentario.get('/:id/comentarios', getComentarios)
export default routerComentario
