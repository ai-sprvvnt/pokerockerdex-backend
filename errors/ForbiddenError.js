class ForbiddenError extends Error {
  constructor(message = 'No tienes permisos para realizar esta acción.') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
