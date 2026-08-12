const dotenv = require('dotenv');

dotenv.config({ quiet: true });

const { NODE_ENV = 'development', PORT = 3000, DB_ADDRESS } = process.env;

const DEVELOPMENT_DB_ADDRESS = 'mongodb://127.0.0.1:27017/pokerockerdex';

const databaseAddress = NODE_ENV === 'production' ? DB_ADDRESS : DEVELOPMENT_DB_ADDRESS;

module.exports = {
  NODE_ENV,
  PORT,
  databaseAddress,
};
