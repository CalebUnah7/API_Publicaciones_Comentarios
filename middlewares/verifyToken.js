//TODO: pendiente de realizar

import jwt from 'jsonwebtoken';

// Middleware para verificar el token
export const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            success: false,
            message: 'Debe iniciar sesión para acceder a este recurso',
        });
    }


    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado',
        });
    }
};
