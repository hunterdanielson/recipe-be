const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: String
  },
  category: {
    type: String
  }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
