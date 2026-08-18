class UnauthorizedError extends Error {
  constructor(message = 'Se requiere autorización.') {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
