import jwt from 'jsonwebtoken';
import HTTPCodes from '../shared/codes.js';
import { AppError } from '../utils/AppError.js';

// Middleware para verificar el token
export const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        const errData = HTTPCodes.errorUnauthorized('Debe iniciar sesión para acceder a este recurso');
        return next(new AppError(errData.statusCode, errData.message));
    }

    // El formato esperado es "Bearer <token>", separamos y tomamos el token
    const token = authorization.split(' ')[1];

    if (!token) {
        const errData = HTTPCodes.errorUnauthorized('Token no proporcionado');
        return next(new AppError(errData.statusCode, errData.message));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Se añade la información del usuario al request
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        const errData = HTTPCodes.errorUnauthorized('Token inválido o expirado');
        return next(new AppError(errData.statusCode, errData.message, error));
    }
};
