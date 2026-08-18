const { celebrate, Joi, Segments } = require('celebrate');

const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateCreatePokemon = celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.number().integer().positive().required(),
    name: Joi.string().trim().required(),
    image: Joi.string().uri().required(),
    types: Joi.array().items(Joi.string().trim().required()).min(1).required(),
  }),
});

const validatePokemonId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateCreatePokemon,
  validatePokemonId,
};
