import { getPublicacionById, getPublicacionRemovidaById } from '../models/publicacion.model.js';

// Revisa si una publicación existe y está activa, o si ha sido removida
export const checkPublicacionExists = (rem = false) => {
    return async (req, res, next) => {
        const { id } = req.params;

        try {
            const publicacion = await getPublicacionById(id);
            
            if (!publicacion || publicacion.length === 0) {
                // Consultar si la publicación fue removida
                const publicacionRemovida = await getPublicacionRemovidaById(id);
                
                if (publicacionRemovida) {
                    const status = rem ? 410 : 404;
                    const message = rem 
                        ? 'La publicación ya había sido removida en el pasado'
                        : 'La publicación ha sido removida';
                    
                    return res.status(status).json({ message });
                }

                return res.status(404).json({
                    message: `La publicación con id ${id} no fue encontrada`
                });
            }

            // Si la publicación existe, la añadimos al request para su uso posterior
            req.publicacion = publicacion[0];
            next();

        } catch (error) {
            next(error);
        }
    };
};