
// Clase personalizada para manejo de errores
export class AppError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}