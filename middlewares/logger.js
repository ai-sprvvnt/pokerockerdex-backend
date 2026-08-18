const winston = require('winston');
const expressWinston = require('express-winston');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: logFormat,
  meta: true,
  requestWhitelist: ['method', 'originalUrl'],
  responseWhitelist: ['statusCode'],
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: 'error.log',
    }),
  ],
  format: logFormat,
  meta: true,
  requestWhitelist: ['method', 'originalUrl'],
  headerBlacklist: ['authorization', 'cookie'],
});

module.exports = {
  requestLogger,
  errorLogger,
};
