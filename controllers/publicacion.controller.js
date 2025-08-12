import { 
        getAllPublicaciones, 
        getPublicacionById, 
        getPublicacionRemovidaById, 
        postPublicacion, 
        putPublicacion,  
        deletePublicacion,
        getTotalPublicaciones
    } from "../models/publicacion.model.js";
import { loginUserByHandle } from "../models/usuario.model.js";
import { validatePublicacion } from "../schemas/publicacion.schema.js";
import { v4 as uuidv4 } from 'uuid';

// Obtener todas la publicaciones activas con paginación
export const getAll = async (req, res)=>{
    //Se obtienen parámetros de paginación con valores por defecto
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page -1) * limit

    try {
        //Total registros activos
        const totalRegistros= await getTotalPublicaciones()
        const totalPaginas= Math.ceil(totalRegistros/limit)

        //Publicaciones paginadas
        const publicaciones = await getAllPublicaciones (limit, offset)
        
        res.status(200).json({
            page: `${page}/${totalPaginas}`,
            total: publicaciones.length,
            publicaciones
        })
    } catch (error){
             res.status(500).json({
            message: 'Error al obtener las publicaciones'
        })
    }
}

// Obtener una publicación por ID
export const getById = async (req, res)=> {
    const {id} = req.params

    try{
        const publicacion = await getPublicacionById(id)

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

// Controlador para crear una nueva publicación
export const createPublicacion = async (req, res) => {
    const data = req.body;
    const { success, error, data: safeData } = validatePublicacion(data)

    if (!success) {
        res.status(400).json(error)
    }

    const id = uuidv4();

    try{
        const userFound = await loginUserByHandle(safeData.handle)
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

// Controlador para editar una publicación
export const editPublicacion = async (req, res) => {
    const { id } = req.params

    const data = req.body;
    const { success, error, data: safeData } = validatePublicacion(data)

    if (!success) {
        res.status(400).json(error);
    }

    try {
        const publicacion = await getPublicacionById(id)

        if (!publicacion || publicacion.length === 0 || publicacion === undefined) {

            const publicacionRemovida = await getPublicacionRemovidaById(id)
            if (publicacionRemovida && publicacionRemovida.length > 0) {
                return res.status(404).json({
                    message: 'La publicación ha sido removida'
                });
            }

            return res.status(404).json({
                message: `La publicación con id ${id} no fue encontrada`
            });
        }
        
        const updatedData = {
            ...safeData,
            autorId: publicacion.autorId
        }

        const response = await putPublicacion(id, updatedData)

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

// Controlador para eliminar una publicación
// Se considera "eliminar" como desactivar la publicación, no eliminarla de la base de datos
export const removePublicacion = async (req, res) => {
    const { id } = req.params

    try{
        const publicacion = await getPublicacionById(id)
        if (!publicacion || publicacion.length === 0 || publicacion === undefined) {
            return res.status(404).json({
                message: `La publicación con id ${id} no fue encontrada`
            });
        }

        if (!publicacion.activo) {
            return res.status(400).json({
                message: 'La publicación ya ha sido removida'
            });
        }

        const responsePub = await deletePublicacion(id)
        res.status(200).json({
            message: 'Publicación removida correctamente',
            response: responsePub
        })

        // Se desactivan los comentarios asociados a la publicación removida
        const responseCom = await deleteComentariosByPublicacionId(id)
        res.status(200).json({
            message: 'Comentarios asociados removidos correctamente',
            response: responsePub
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al remover la publicación',
        });
    }

}