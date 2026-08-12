const express = require('express');
const cors = require('cors');

const teamsRouter = require('./routes/teams');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/teams', teamsRouter);

app.listen(PORT, () => {
  console.log(`PokeRockerDex backend listening on port ${PORT}`);
});
