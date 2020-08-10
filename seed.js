require('dotenv').config();
require('./lib/utils/connect')();

const mongoose = require('mongoose');
const seed = require('./lib/services/seed');

seed()
  .then(() => console.log('Database seeded'))
  .finally(() => mongoose.connection.close());

