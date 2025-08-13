import { error } from 'console'
import { createComentario,getComentariosByPublicacionId } from '../models/comentario.model.js'
import { getPublicacionById } from '../models/publicacion.model.js'
import { validateComentario} from '../schemas/comentario.schema.js'
import { v4 as uuidv4 } from 'uuid'
import sanitizeHtml from 'sanitize-html'

export async function crearComentario(req, res){

        const {id:publicacion_id} = req.params
        const user_id = req.user.id
        const {contenido} = req.body
    

        const publicacion = await getPublicacionById(publicacion_id)

        if(!publicacion || publicacion.length === 0){
            return res.status(404).json({
                message: 'La publicacion no fue encontrada'
            })
        }
        
        //hacemos la sanitización del comentario
        const texto = sanitizeHtml(contenido,{
            allowedTags : [], // No se permiten etiquetas HTML
            AllowedAtributes : {} // tampoco se permiten atributos
        })

        const parseComentario = validateComentario({contenido: texto})
        if (!parseComentario.success) {
            return res.status(400).json({
                message: 'Error de validación',
                error: parseComentario.error
            });
        }
    try {
        
        //como hacer para que el id del usuario que crea el comentario se guarde
        //const user_id = 1//req.user.id // asumiendo que el id del usuario está en req.user.id
        //user_id = 1 // temporalmente, deberías obtenerlo del token JWT o de la sesión del usuario
        const id = uuidv4() // generar un nuevo UUID para el comentario
        console.log('ID del comentario:', id, publicacion_id, user_id, texto)
        const result = await createComentario([id,publicacion_id,user_id,texto])
        console.log(result)
        if(!result){
            //console.error('Error al crear el comentario', e)
            return res.status(400).json({
                message: 'Error al crear el comentario'
            })
        }

        res.status(201).json({
            message: 'Comentario creado exitosamente',
            comentario: texto
        })
        } catch (error) {
            
        res.status(500).json({
            message: 'Error al crear el comentario hola'
        })
    }
}

export async function getComentarios(req,res){
    try {
    const {id:publicacion_id} = req.params

    const publicacion = await getPublicacionById(publicacion_id)

    if(!publicacion || publicacion.length === 0){
        return res.status(404).json({
            message: 'La publicacion no fue encontrada'
        })
    }

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