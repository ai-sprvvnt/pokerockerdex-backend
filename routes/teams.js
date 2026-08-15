const router = require('express').Router();

const { getTeam, addPokemon } = require('../controllers/teams');

const { validateCreatePokemon } = require('../utils/validation');

router.get('/', getTeam);

router.post('/pokemon', validateCreatePokemon, addPokemon);

module.exports = router;
