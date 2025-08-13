import { validate as isUuid } from 'uuid';
import Respuestas from '../utils/respuestas.js';

// Middleware que se encarga de valdidar que el ID proporcionado en los parámetros de la ruta es un UUID válido
export function validateUUID(req, res, next) {
    const { id } = req.params;
    // Verificar si el ID está presente
    if (!id) {
        return Respuestas.errorInvalid(res, 'Se requiere un ID en los parámetros de la ruta');
    }
    // Verificar si el ID es un UUID válido
    if (!isUuid(id)) {
        return Respuestas.errorInvalid(res, 'El ID proporcionado no es un UUID válido');
    }
    
    next();
}