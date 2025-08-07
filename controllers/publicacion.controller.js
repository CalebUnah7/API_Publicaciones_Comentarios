import { getAllPublicaciones, getPublicacionesById, postPublicacion, putPublicacion,  deletePublicacion } from "../models/publicacion.model.js";
import { getUserIdByHandle } from "../models/usuario.model.js";
import { validatePublicacion } from "../schemas/publicacion.schema.js";
import { v4 as uuidv4 } from 'uuid';

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
        res.status(500).json({
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

export const createPublicacion = async (req, res) => {
    const data = req.body;
    const { success, error, data: safeData } = validatePublicacion(data)

    if (!success) {
        res.status(400).json(error)
    }

    const id = uuidv4();

    try{
        const userFound = await getUserIdByHandle(safeData.handle)
        if (!userFound) {
            return res.status(404).json({
                message: `El usuario con handle @${safeData.handle} no fue encontrado`
            });
        }

        const response = await postPublicacion(id, safeData.titulo, safeData.contenido, userFound.id)

        res
            .status(201) // establece el código de estado HTTP a 201 (Creado)
            .json(response)

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al crear la publicación',
        });
    }
}

export const editPublicacion = async (req, res) => {
    const { id } = req.params
    const parsedId = Number(id)

    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El id debe ser un número'
        })
    }

    const data = req.body;
    const { success, error, data: safeData } = validatePublicacion(data)

    if (!success) {
        res.status(400).json(error);
    }

    try {
        const publicacion = await getPublicacionesById(parsedId)
        if (!publicacion || publicacion.length === 0 || publicacion === undefined) {
            return res.status(404).json({
                message: `La publicación con id ${id} no fue encontrada`
            });
        }

        const updatedData = {
            ...safeData,
            autorId: publicacion.autorId
        }

        const response = await putPublicacion(parsedId, updatedData)

        res.json({
            message: 'Publicación editada correctamente',
            producto: response
        });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al editar la publicación',
        });
    }

}

export const removePublicacion = async (req, res) => {
    const { id } = req.params
    const parsedId = Number(id)

    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El id debe ser un número'
        })
    }

    try{
        const publicacion = await getPublicacionesById(parsedId)
        if (!publicacion || publicacion.length === 0 || publicacion === undefined) {
            return res.status(404).json({
                message: `La publicación con id ${id} no fue encontrada`
            });
        }

        const response = await deletePublicacion(parsedId)
        res.status(200).json({
            message: 'Publicación removida correctamente',
            response: response
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al remover la publicación',
        });
    }

}