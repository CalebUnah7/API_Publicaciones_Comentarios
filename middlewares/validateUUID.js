import { validate as isUuid } from 'uuid';
import HTTPCodes from '../shared/codes.js';
import { AppError } from '../utils/AppError.js';

// Middleware que se encarga de valdidar que el ID proporcionado en los parámetros de la ruta es un UUID válido
export function validateUUID(req, res, next) {
    const { id } = req.params;
    // Verificar si el ID está presente
    if (!id) {
        const errData = HTTPCodes.errorBadRequest('Se requiere un ID en los parámetros de la ruta');
        return next(new AppError(errData.statusCode, errData.message));
    }
    // Verificar si el ID es un UUID válido
    if (!isUuid(id)) {
        const errData = HTTPCodes.errorBadRequest('El ID proporcionado no es un UUID válido');
        return next(new AppError(errData.statusCode, errData.message));
    }
    
    next();
}