require('dotenv').config();
const chance = require('chance').Chance();
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');

module.exports = async({ recipes = 5, ingredients = 15 } = {}) => {
  const createdRecipes = await Recipe.create([...Array(recipes)].map(() => ({
    name: chance.name(),
    instructions: chance.sentence(),
    prepTime: chance.natural({ max: 10 }) + ' minutes',
    calories: chance.natural({ max: 1000 }),
    servingSize: chance.natural({ max: 20 })
  })));

  await Ingredient.create([...Array(ingredients)].map(() => ({
    recipe: chance.pickone(createdRecipes)._id,
    name: chance.word(),
    amount: chance.natural({ max: 20 }),
    category: chance.word()
  })));
};
