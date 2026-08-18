const { rateLimit } = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
  },
});

module.exports = apiLimiter;
