import { validateComentario } from '../schemas/comentario.schema.js';

export const validateSchemaComentarios = (req, res, next) => {
  const result = validateComentario(req.body);
  if (!result.success) {
    const mensajes = result.error?.issues?.map(e => e.message).join('. ') || "Error desconocido";
    return res.status(400).json({
      status: "error",
      error: mensajes
    });
  }
  req.body = result.data;
  next();
};

