import { 
        getAllPublicaciones, 
        getPublicacionById, 
        getPublicacionRemovidaById, 
        postPublicacion, 
        putPublicacion,  
        deletePublicacion,
        getTotalPublicaciones
    } from "../models/publicacion.model.js";
import {deleteComentariosByPublicacionId} from "../models/comentario.model.js"
import { loginUserByHandle } from "../models/usuario.model.js";
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

    const id = uuidv4();

    try{
        const autorId = req.user.id; // ya viene del token validado
        const response = await postPublicacion(id, safeData.titulo, safeData.contenido, autorId);

        //const userFound = await loginUserByHandle(safeData.handle)
       // if (!userFound) {
          //  return res.status(404).json({
              //  message: `El usuario con handle @${safeData.handle} no fue encontrado`
          //  });
      //  }

       // const response = await postPublicacion(id, safeData.titulo, safeData.contenido, userFound.id)

        res.status(201).json({
                success: true,
                message: "Publicacion creada exitosamente",
                id: id
            })


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
    const autorId = req.user.id
    const data = req.body;

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
            autorId: autorId
        }
        //console.log(updatedData)
        const response = await putPublicacion(id, updatedData)
        //console.log(response)
        if(!response){
            return res.status(400).json({
                message: `No se pudo actualizar la publicación, verifique que el autor sea el mismo`
            })
        }
        
        res.json({
            message: 'Publicación editada correctamente',
            publicacion: {
                titulo: safeData.titulo,
                contenido: safeData.contenido
            }
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
    const autorId = req.user.id
    try{
        const publicacion = await getPublicacionById(id)
        if (!publicacion || publicacion.length === 0 || publicacion === undefined) {
            return res.status(404).json({
                message: `La publicación con id ${id} no fue encontrada`
            });
        }

       /* if (!publicacion.activo) {
            return res.status(400).json({
                message: 'La publicación ya ha sido removida'
            });
        }*/

        const responsePub = await deletePublicacion(id,autorId)
        console.log(responsePub)
        if(!responsePub){
            return res.status(400).json({
                message: `No se pudo remover la publicación, verifique que el autor sea el mismo`
            })
        }
        /*res.status(200).json({
            message: 'Publicación removida correctamente'
        })*/

        // Se desactivan los comentarios asociados a la publicación removida
        const responseCom = await deleteComentariosByPublicacionId(id)
        res.status(200).json({
            message: 'Publicacion y Comentarios asociados removidos correctamente'
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al remover la publicación',
        });
    }

}