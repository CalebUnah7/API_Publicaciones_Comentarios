import { crearComentario,getComentarios } from '../controllers/comentario.controller.js'
import { Router} from 'express'

const router = Router()

router.post('/:id/comentarios', crearComentario)
router.get('/:id/comentarios', getComentarios)
export default router
