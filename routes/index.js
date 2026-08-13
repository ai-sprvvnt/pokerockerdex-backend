const router = require('express').Router();

const teamsRouter = require('./teams');

router.use('/teams', teamsRouter);

module.exports = router;
