const mongoose = require('mongoose');
const validator = require('validator');

const pokemonSchema = new mongoose.Schema({
  pokemonId: {
    type: Number,
    required: true,
    min: 1,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'La URL de la imagen no es válida.',
    },
  },
  types: {
    type: [String],
    required: true,
    validate: {
      validator: (values) => values.length > 0,
      message: 'El Pokémon debe tener al menos un tipo.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

pokemonSchema.index({ owner: 1, pokemonId: 1 }, { unique: true });

module.exports = mongoose.model('pokemon', pokemonSchema);
