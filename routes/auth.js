const router = require('express').Router();

const { createUser } = require('../controllers/users');
const { validateSignup } = require('../utils/validation');

router.post('/signup', validateSignup, createUser);

module.exports = router;
