const express = require('express');

const router = express.Router();

const MAX_TEAM_SIZE = 6;
const team = [];

function isValidPokemon(pokemon) {
  return (
    pokemon !== null
    && typeof pokemon === 'object'
    && Number.isInteger(pokemon.id)
    && pokemon.id > 0
    && typeof pokemon.name === 'string'
    && pokemon.name.trim().length > 0
    && typeof pokemon.image === 'string'
    && Array.isArray(pokemon.types)
    && pokemon.types.length > 0
    && pokemon.types.every(
      (type) => typeof type === 'string' && type.trim().length > 0,
    )
  );
}

router.get('/', (req, res) => {
  res.status(200).send({
    pokemon: team,
    teamSize: team.length,
    maxTeamSize: MAX_TEAM_SIZE,
  });
});

router.post('/pokemon', (req, res) => {
  const pokemon = req.body;

  if (!isValidPokemon(pokemon)) {
    return res.status(400).send({
      message: 'Los datos del Pokémon no son válidos.',
    });
  }

  const alreadyExists = team.some(
    (teamPokemon) => teamPokemon.id === pokemon.id,
  );

  if (alreadyExists) {
    return res.status(409).send({
      message: 'Este Pokémon ya pertenece al equipo.',
    });
  }

  if (team.length >= MAX_TEAM_SIZE) {
    return res.status(409).send({
      message: 'El equipo ya tiene el máximo de 6 Pokémon.',
    });
  }

  const teamPokemon = {
    id: pokemon.id,
    name: pokemon.name.trim().toLowerCase(),
    image: pokemon.image,
    types: pokemon.types.map((type) => type.trim().toLowerCase()),
  };

  team.push(teamPokemon);

  return res.status(201).send({
    pokemon: teamPokemon,
    teamSize: team.length,
    maxTeamSize: MAX_TEAM_SIZE,
  });
});

module.exports = router;
