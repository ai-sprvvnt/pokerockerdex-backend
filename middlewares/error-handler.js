const { isCelebrateError } = require('celebrate');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (isCelebrateError(err)) {
    return res.status(400).send({
      message: 'Los datos de la solicitud no son válidos.',
    });
  }

  const { statusCode = 500, message } = err;

  if (statusCode === 500) {
    return res.status(500).send({
      message: 'Se produjo un error en el servidor.',
    });
  }

  return res.status(statusCode).send({
    message,
  });
};

module.exports = errorHandler;
