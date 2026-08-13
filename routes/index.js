const router = require('express').Router();

const authRouter = require('./auth');
const teamsRouter = require('./teams');

router.use('/', authRouter);
router.use('/teams', teamsRouter);

module.exports = router;
