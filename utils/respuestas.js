
export class Respuestas {

  static _buildBody(message, payloadKey, payloadValue) {
    const body = { message };
    if (payloadKey && payloadValue !== undefined) body[payloadKey] = payloadValue;
    return body;
  }


  static _error(res, status, message, errorDetails) {
    const body = this._buildBody(message, errorDetails ? 'error' : null, errorDetails);
    return res.status(status).json(body);
  }

  static _success(res, status, message, data) {
    const body = this._buildBody(message, data !== undefined ? 'data' : null, data);
    return res.status(status).json(body);
  }


  static errorNF(res, message = 'No encontrado', errorDetails) {
    return this._error(res, 404, message, errorDetails);
  }
  static error400(res, message = 'Solicitud inválida', errorDetails) {
    return this._error(res, 400, message, errorDetails);
  }
  static error500(res, message = 'Error interno', errorDetails) {
    return this._error(res, 500, message, errorDetails);
  }

  static ok(res, message = 'OK', data) {
    return this._success(res, 200, message, data);
  }
  static created(res, message = 'Creado', data) {
    return this._success(res, 201, message, data);
  }

  static sendSuccess(res, data, message = 'Operación exitosa') {
    return this.ok(res, message, data);
  }

  static sendValidationError(res, parseResult, message = 'Error de validación') {
    const details = parseResult && parseResult.error ? parseResult.error : undefined;
    return this.error400(res, message, details);
  }
}
