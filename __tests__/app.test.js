const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/Recipe');

describe('recipe-be routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('will create a new recipe via POST', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'potatoe',
        prepTime: '15 minutes',
        instructions: 'cook the thing'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'potatoe',
          prepTime: '15 minutes',
          instructions: 'cook the thing'
        });
      });
  });

  it('will get recipes via GET', async() => {
    const recipes = await Recipe.find();
    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        expect(res.body).toEqual(recipes);
      });
  });
});
