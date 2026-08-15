const router = require('express').Router();

const { getTeam, addPokemon, deletePokemon } = require('../controllers/teams');

const {
  validateCreatePokemon,
  validatePokemonId,
} = require('../utils/validation');

router.get('/', getTeam);

router.post('/pokemon', validateCreatePokemon, addPokemon);

router.delete('/pokemon/:id', validatePokemonId, deletePokemon);

module.exports = router;
