
// Función para envolver middlewares asíncronos y manejar errores
// Esta función permite que los errores en middlewares asíncronos sean capturados 
// y pasados al manejador de errores centralizado
const asyncMiddleware = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncMiddleware;
