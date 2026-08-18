const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const helmet = require('helmet');
const routes = require('./routes');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/error-handler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const apiLimiter = require('./middlewares/rate-limiter');

const { PORT, databaseAddress } = require('./utils/config');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use(apiLimiter);

app.use('/', routes);

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use(errorLogger);
app.use(errorHandler);

mongoose
  .connect(databaseAddress)
  .then(() => {
    app.listen(PORT, '127.0.0.1', () => {
      console.log(`PokeRockerDex backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
