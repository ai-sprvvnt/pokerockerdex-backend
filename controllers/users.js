const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { SALT_ROUNDS, DUPLICATE_KEY_ERROR_CODE } = require('../utils/constants');

const UnauthorizedError = require('../errors/UnauthorizedError');
const { jwtSecret } = require('../utils/config');

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

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(
          'Correo electrónico o contraseña incorrectos.',
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError(
            'Correo electrónico o contraseña incorrectos.',
          );
        }

        const token = jwt.sign({ _id: user._id }, jwtSecret, {
          expiresIn: '7d',
        });

        return res.status(200).send({ token });
      });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
};
