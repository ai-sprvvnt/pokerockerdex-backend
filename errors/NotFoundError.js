class NotFoundError extends Error {
  constructor(message = 'Recurso solicitado no encontrado.') {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
