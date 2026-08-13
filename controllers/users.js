const bcrypt = require('bcrypt');

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { SALT_ROUNDS, DUPLICATE_KEY_ERROR_CODE } = require('../utils/constants');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.code === DUPLICATE_KEY_ERROR_CODE) {
        return next(
          new ConflictError(
            'Ya existe un usuario con este correo electrónico.',
          ),
        );
      }

      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Los datos del usuario no son válidos.'),
        );
      }

      return next(err);
    });
};

module.exports = {
  createUser,
};
