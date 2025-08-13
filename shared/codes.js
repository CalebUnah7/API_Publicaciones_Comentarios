export default class HTTPCodes {
    // Respuestas exitosas
    static successOk = (message, data) => {
        return {
            status: 200,
            message,
            data
        };
    };

    static successCreated = (message, data) => {
        return {
            status: 201,
            message,
            data
        };
    };

    // Errores del cliente
    static errorBadRequest = (message, error) => {
        return {
            statusCode: 400,
            message,
            error
        };
    };

    static errorUnauthorized = (message, error) => {
        return {
            statusCode: 401,
            message,
            error
        };
    };

    static errorNotFound = (message) => {
        return {
            statusCode: 404,
            message
        };
    };

    static errorGone = (message) => {
        return {
            statusCode: 410,
            message
        };
    };

    static errorUnprocessable = (message, error) => {
        return {
            statusCode: 422,
            message,
            error
        };
    };

    // Error del servidor
    static errorServer = (message, error) => {
        return {
            statusCode: 500,
            message,
            error
        };
    };
}
