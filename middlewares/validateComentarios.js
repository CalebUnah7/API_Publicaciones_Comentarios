import { validateComentario } from '../schemas/comentario.schema.js';
import { AppError } from '../utils/AppError.js';
import HTTPCodes from '../shared/codes.js';


export const validateSchemaComentarios = (req, res, next) => {
  const result = validateComentario(req.body);
  if (!result.success) {
    const details = result.error?.issues?.map(e => e.message) || "Error desconocido";
    const errData = HTTPCodes.errorBadRequest(`No se han cumplido los requerimientos de un Comentario`);
    return next(new AppError(errData.statusCode, errData.message, details));
  }
  req.body = result.data;
  next();
};

