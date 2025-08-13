// Middleware para manejo centralizado de errores
export const errorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    res.status(error.statusCode).json({
        status: error.statusCode,
        tipo: error.status,
        message: error.message,
        details: error.details
    });
};
