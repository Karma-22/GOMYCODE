const mongoose = require('mongoose');

/**
 * Person Schema Definition:
 * - name: String (required)
 * - age: Number
 * - favoriteFoods: Array of Strings
 */
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la personne est requis']
  },
  age: {
    type: Number,
    min: 0,
    default: 18
  },
  favoriteFoods: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
