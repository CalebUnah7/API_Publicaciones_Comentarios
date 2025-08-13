import { getPublicacionById, getPublicacionRemovidaById } from '../models/publicacion.model.js';
import HTTPCodes from '../shared/codes.js';
import { AppError } from '../utils/AppError.js';

// Revisa si una publicación existe y está activa, o si ha sido removida
export const checkPublicacionExists = (rem = false) => {
    return async (req, res, next) => {
        const { id } = req.params;

        try {
            const publicacion = await getPublicacionById(id);
            
            if (!publicacion || publicacion.length === 0) {
                // Consultar si la publicación fue removida
                const publicacionRemovida = await getPublicacionRemovidaById(id);
                
                let errData;
                if (publicacionRemovida) {
                    errData = rem
                        ? HTTPCodes.errorNotFound('La publicación ya había sido removida en el pasado')
                        : HTTPCodes.errorGone('La publicación ha sido removida');
                    } else {
                    errData = HTTPCodes.errorNotFound(`La publicación con id ${id} no fue encontrada`);
                    }
                    // Lanzar un error personalizado
                    return next(new AppError(errData.statusCode, errData.message));
                
                // return res.status(404).json({
                //     message: `La publicación con id ${id} no fue encontrada`
                // });
            }

            // Si la publicación existe, la añadimos al request para su uso posterior
            req.publicacion = publicacion[0];
            next();

        } catch (error) {
            next(error);
        }
    };
};