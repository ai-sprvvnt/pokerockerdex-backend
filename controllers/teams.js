const Pokemon = require('../models/pokemon');

const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const {
  DUPLICATE_KEY_ERROR_CODE,
  MAX_TEAM_SIZE,
} = require('../utils/constants');

const formatPokemon = (pokemon) => ({
  _id: pokemon._id,
  id: pokemon.pokemonId,
  name: pokemon.name,
  image: pokemon.image,
  types: pokemon.types,
});

const getTeam = (req, res, next) => Pokemon.find({
  owner: req.user._id,
})
  .then((pokemon) => res.status(200).send({
    pokemon: pokemon.map(formatPokemon),
    teamSize: pokemon.length,
    maxTeamSize: MAX_TEAM_SIZE,
  }))
  .catch(next);

const addPokemon = async (req, res, next) => {
  const {
    id, name, image, types,
  } = req.body;

  try {
    const existingPokemon = await Pokemon.findOne({
      owner: req.user._id,
      pokemonId: id,
    });

    if (existingPokemon) {
      throw new ConflictError('Este Pokémon ya pertenece al equipo.');
    }

    const teamSize = await Pokemon.countDocuments({
      owner: req.user._id,
    });

    if (teamSize >= MAX_TEAM_SIZE) {
      throw new ConflictError('El equipo ya tiene el máximo de 6 Pokémon.');
    }

    const pokemon = await Pokemon.create({
      pokemonId: id,
      name: name.trim().toLowerCase(),
      image,
      types: types.map((type) => type.trim().toLowerCase()),
      owner: req.user._id,
    });

    return res.status(201).send({
      pokemon: formatPokemon(pokemon),
      teamSize: teamSize + 1,
      maxTeamSize: MAX_TEAM_SIZE,
    });
  } catch (err) {
    if (err.code === DUPLICATE_KEY_ERROR_CODE) {
      return next(new ConflictError('Este Pokémon ya pertenece al equipo.'));
    }

    return next(err);
  }
};

const deletePokemon = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pokemon = await Pokemon.findById(id).select('+owner');

    if (!pokemon) {
      throw new NotFoundError('Pokémon no encontrado.');
    }

    if (!pokemon.owner.equals(req.user._id)) {
      throw new ForbiddenError('No tienes permiso para eliminar este Pokémon.');
    }

    await pokemon.deleteOne();

    const teamSize = await Pokemon.countDocuments({
      owner: req.user._id,
    });

    return res.status(200).send({
      pokemon: formatPokemon(pokemon),
      teamSize,
      maxTeamSize: MAX_TEAM_SIZE,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getTeam,
  addPokemon,
  deletePokemon,
};
