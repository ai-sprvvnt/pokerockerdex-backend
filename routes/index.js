const router = require('express').Router();

const authRouter = require('./auth');
const usersRouter = require('./users');
const teamsRouter = require('./teams');
const auth = require('../middlewares/auth');

router.use('/', authRouter);

router.use('/users', auth, usersRouter);
router.use('/teams', auth, teamsRouter);

module.exports = router;
