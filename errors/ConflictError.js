class ConflictError extends Error {
  constructor(
    message = 'La solicitud entra en conflicto con los datos existentes.',
  ) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
