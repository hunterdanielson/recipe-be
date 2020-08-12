require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('auth routes', () => {
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

  it('signs up a user via signup route with passed in variables', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'fake@email.com',
        password: 'password',
        profileImage: 'img.png'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'fake@email.com',
          profileImage: 'img.png'
        });
      });
  });

  it('logs in a user with correct email and password', async() => {
    await User.create({
      email: 'fake@email.com',
      password: 'password',
      profileImage: 'img.png'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'fake@email.com',
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'fake@email.com',
          profileImage: 'img.png'
        });
      });
  });

  it('verifies a signed up user', () => {
    const agent = request.agent(app);
    return agent
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .then(() => agent.get('/api/v1/auth/verify'))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com'
        });
      });
  });

  it('can verify that a user can log in to an existing account', async() => {
    await User.create({
      email: 'fake@email.com',
      password: 'password',
      profileImage: 'img.png'
    });
    const agent = request.agent(app);
    return agent
      .post('/api/v1/auth/login')
      .send({ 
        email: 'fake@email.com',
        password: 'password' 
      })
      .then(() => agent.get('/api/v1/auth/verify')
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.anything(),
            email: 'fake@email.com',
            profileImage: 'img.png'
          });
        }));
  });
});
