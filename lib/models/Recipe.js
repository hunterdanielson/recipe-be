const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  prepTime: {
    type: Number,
  },
  calories: {
    type: Number
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
    }
  }, toObject: {
    virtuals: true
  }
});

recipeSchema.virtual('ingredients', {
  ref: 'Ingredient',
  localField: '_id',
  foreignField: 'recipe'
});

module.exports = mongoose.model('Recipe', recipeSchema);
