const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const teamsRouter = require('./routes/teams');
const { PORT, databaseAddress } = require('./utils/config');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/teams', teamsRouter);

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
