class BadRequestError extends Error {
  constructor(message = 'La solicitud no es válida.') {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
