import { error } from 'console'
import { CreateComentario,getComentariosByPublicacionId } from '../models/comentario.model.js'
import { v4 as uuidv4 } from 'uuid'
export async function crearComentario(req, res){
    try {
        const {comentario} = req.body
        const {id:publicacion_id} = req.params
        //como hacer para que el id del usuario que crea el comentario se guarde
        const user_id = 1//req.user.id // asumiendo que el id del usuario está en req.user.id
        //user_id = 1 // temporalmente, deberías obtenerlo del token JWT o de la sesión del usuario
        const id2 = uuidv4() // generar un nuevo UUID para el comentario
        const result = await CreateComentario(id2,publicacion_id,user_id,comentario)
        console.log(result)
        if(!result){
            console.error('Error al crear el comentario', e)
            return res.status(400).json({
                message: 'Error al crear el comentario'
            })
        }

        res.status(201).json({
            message: 'Comentario creado exitosamente',
            comentario
        })
        } catch (error) {
            //console.log('ID del comentario:', id,publicacion_id,user_id,comentario)
       console.error('Error al crear el comentario:', error)
        res.status(500).json({
            message: 'Error al crear el comentario'
        })
    }
}

export async function getComentarios(req,res){
   
   try {
    const {id:publicacion_id} = req.params
    const comentarios = await getComentariosByPublicacionId(publicacion_id)
    if(!comentarios || comentarios.length === 0){
        return res.status(404).json({
            message: 'No se encontraron comentarios para esta publicacion'
        })
    }
    res.status(200).json({comentarios})
   } catch (error) {
    res.status(500).json({
        message: 'Error al obtener los comentarios'
    })
   } 
}