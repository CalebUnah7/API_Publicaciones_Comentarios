import { validatePublicacion } from '../schemas/publicacion.schema.js';

export const validateSchemaPublicaciones = (req, res, next) => {
  const result = validatePublicacion(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: "error",
      errores: result.error.issues.map(e => e.message)
    });
  }
  req.body = result.data;
  next();
};

