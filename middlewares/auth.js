const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');
const { jwtSecret } = require('../utils/config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Se requiere autorización.'));
  }

  const token = authorization.slice(7);

  if (!token) {
    return next(new UnauthorizedError('Se requiere autorización.'));
  }

  try {
    const payload = jwt.verify(token, jwtSecret);

    req.user = payload;

    return next();
  } catch (err) {
    return next(new UnauthorizedError('Token inválido o expirado.'));
  }
};

module.exports = auth;
