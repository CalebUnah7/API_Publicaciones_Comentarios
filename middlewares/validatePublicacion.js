import { validatePublicacion } from '../schemas/publicacion.schema.js';
import { AppError } from '../utils/AppError.js';
import HTTPCodes from '../shared/codes.js';

export const validateSchemaPublicaciones = (req, res, next) => {
  const result = validatePublicacion(req.body);
  if (!result.success) {
    const details = result.error?.issues?.map(e => e.message) || "Error desconocido";
    const errData = HTTPCodes.errorBadRequest(`No se cumplieron los requerimientos de una Publicación`);
    return next(new AppError(errData.statusCode, errData.message, details));
  }
  req.body = result.data;
  next();
};

