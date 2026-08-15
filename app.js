const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const routes = require('./routes');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/error-handler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, databaseAddress } = require('./utils/config');

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use('/', routes);

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use(errorLogger);
app.use(errorHandler);

mongoose
  .connect(databaseAddress)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`PokeRockerDex backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
