import { getAllPublicaciones, getPublicacionesById } from "../models/publicacion.model.js";
 
export const getAll = async (req, res)=>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page -1) * limit

    try {
        const publicaciones = await getAllPublicaciones (limit, offset)
        
        res.status(200).json({
            page,
            total: publicaciones.length,
            publicaciones
        })
    } catch (error){
        res.status(400).json({
            message: 'Error al obtener las publicaciones'
        })
    }
 }

 export const getById = async (req, res)=> {
    const {id} = req.params

    try{
        const publicacion = await getPublicacionesById(id)

        if(!publicacion || publicacion.length === 0){
            return res.status(404).json({
                message: 'La publicacion no fue encontrada'
            })
        }

        res.status(200).json(publicacion[0])
    }catch(error){
        res.status(400).json({
            message: 'Error al obtener la publicacion'
        })
    }
 }