const { Router } = require('express');
const Ingredient = require('../models/Ingredient');

module.exports = Router()
  .post('/', (req, res, next) => {
    Ingredient
      .create({ ...req.body })
      .then(ingredient => res.send(ingredient))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Ingredient
      .find()
      .then(ingredient => res.send(ingredient))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Ingredient
      .findByIdAndDelete(req.params.id)
      .then(recipe => res.send(recipe))
      .catch(next);
  });
