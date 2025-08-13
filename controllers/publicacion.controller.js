import HTTPCodes from "../shared/codes.js";
import { AppError } from '../utils/AppError.js';
import { 
        getAllPublicaciones, 
        getPublicacionById, 
        getPublicacionRemovidaById, 
        getPublicacionByQuery,
        postPublicacion, 
        putPublicacion,  
        deletePublicacion,
        getTotalPublicaciones
    } from "../models/publicacion.model.js";
import {deleteComentariosByPublicacionId} from "../models/comentario.model.js"
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
            const errData = HTTPCodes.errorServer('Error interno del servidor al obtener las publicaciones');
            throw new AppError(errData.statusCode, errData.message, error);
    }
}


// Obtener una publicación por ID
export const getById = async (req, res)=> {
    const {id} = req.params
    const data = req.publicacion

    try{
        if (!data) {
            const errData = HTTPCodes.errorUnprocessable('Error interno: publicación no valida');
            throw new AppError(errData.statusCode, errData.message);
        }

        res.status(200).json(data)
    }catch(error){
        if (error instanceof AppError) {
            // Se vuelve a lanzar el error para que el manejador de errores lo procese
            throw error;
        }
        
        const errData = HTTPCodes.errorServer('Error interno del servidor al obtener la publicación');
        throw new AppError(errData.statusCode, errData.message, error);
    }
}

//Buscar una publicación de acuerdo a una Query

export const getByQuery = async (req, res) => {
    const { titulo, contenido } = req.query;
    let datosFiltrados = []

    // Normalizar el texto para evitar problemas con acentos y mayúsculas
    const normalizarTexto = (texto) => {
        if (!texto) return '';
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    };
    const tituloNormalizado = normalizarTexto(titulo);
    const contenidoNormalizado = normalizarTexto(contenido);

    if (!titulo && !contenido) {
        const errData = HTTPCodes.errorBadRequest('Ingrese al menos un parámetro de búsqueda');
        throw new AppError(errData.statusCode, errData.message);
    } else
    if (!tituloNormalizado && !contenidoNormalizado) {
        const errData = HTTPCodes.errorBadRequest('Ingrese parámetros de búsqueda válidos');
        throw new AppError(errData.statusCode, errData.message);
    }
    
    try {
        if (tituloNormalizado && contenidoNormalizado) {
            datosFiltrados = await getPublicacionByQuery(tituloNormalizado, contenidoNormalizado);
        } else 
        if (contenidoNormalizado) {
            datosFiltrados = await getPublicacionByQuery('', contenidoNormalizado);
        } else {
            datosFiltrados = await getPublicacionByQuery(tituloNormalizado, '');
        }

        if ( datosFiltrados.length === 0 || datosFiltrados === undefined) {
            const errData = HTTPCodes.errorNotFound('No se encontraron publicaciones con los criterios de búsqueda proporcionados');
            throw new AppError(errData.statusCode, errData.message);
        }

        res.status(200).json(datosFiltrados);
    } catch (error) {

        if (error instanceof AppError) {
            // Se vuelve a lanzar el error para que el manejador de errores lo procese
            throw error;
        }
        console.error(error);
        const errData = HTTPCodes.errorServer('Error interno del servidor al buscar publicaciones');
        throw new AppError(errData.statusCode, errData.message, error);
    }
}

// Controlador para crear una nueva publicación
export const createPublicacion = async (req, res) => {
    const data = req.body;

    const id = uuidv4();

    try{
        const autorId = req.user.id; // ya viene del token validado
        const response = await postPublicacion(id, data.titulo, data.contenido, autorId);

        if (!response) {
            const errData = HTTPCodes.errorBadRequest('Error al crear la publicación, verifique la información proporcionada');
            throw new AppError(errData.statusCode, errData.message);
        }
        
        res.status(201).json({
                success: true,
                message: "Publicacion creada exitosamente",
                id: id
            })


    } catch (error) {
        if (error instanceof AppError) {
            // Se vuelve a lanzar el error para que el manejador de errores lo procese
            throw error;
        }

        console.error(error);
        const errData = HTTPCodes.errorServer('Error interno del servidor al crear la publicación');
        throw new AppError(errData.statusCode, errData.message, error);
    }
}

// Controlador para editar una publicación
export const editPublicacion = async (req, res) => {
    const { id } = req.params
    const autorId = req.user.id
    const data = req.body;

    try {
        const updatedData = {
            ...data,
            autorId: autorId
        }
        const response = await putPublicacion(id, updatedData)
        if(!response){
            const errData = HTTPCodes.errorUnauthorized('No se pudo actualizar la publicación, verifique que el autor sea el mismo');
            throw new AppError(errData.statusCode, errData.message);
        }
        
        res.json({
            message: 'Publicación editada correctamente',
            publicacion: {
                titulo: data.titulo,
                contenido: data.contenido
            }
        });
    
    } catch (error) {
        if (error instanceof AppError) {
            // Se vuelve a lanzar el error para que el manejador de errores lo procese
            throw error;
        }

        console.error(error);
        const errData = HTTPCodes.errorServer('Error interno del servidor al editar la publicación');
        throw new AppError(errData.statusCode, errData.message, error);
    }

}

// Controlador para eliminar una publicación
// Se considera "eliminar" como desactivar la publicación (eliminación lógica), no eliminarla de la base de datos 
export const removePublicacion = async (req, res) => {
    const { id } = req.params
    const autorId = req.user.id
    try{
        const responsePub = await deletePublicacion(id, autorId)
        
        if(!responsePub){
            const errData = HTTPCodes.errorUnauthorized('No se pudo remover la publicación, verifique que el autor sea el mismo');
            throw new AppError(errData.statusCode, errData.message);
        }

        // Se desactivan los comentarios asociados a la publicación removida
        const responseCom = await deleteComentariosByPublicacionId(id)

        //En caso de que no existan comentarios asociados a la publicación, se remueve solamente la publicación
        if(!responseCom){
            return res.status(200).json({
                message: 'Publicación removida correctamente'
            })
        }
        
        res.status(200).json({
            message: 'Publicacion y Comentarios asociados removidos correctamente'
        })

    } catch (error) {
        if (error instanceof AppError) {
            // Se vuelve a lanzar el error para que el manejador de errores lo procese
            throw error;
        }
        
        console.error(error);
        const errData = HTTPCodes.errorServer('Error interno del servidor al remover la publicación');
        throw new AppError(errData.statusCode, errData.message, error);
    }

}

