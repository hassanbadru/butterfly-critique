const shortid = require('shortid');
const express = require('express');
const lowdb  = require('lowdb');
const FileAsync  = require('lowdb/adapters/FileAsync');

const constants = require('./constants');

const { getButterfly, createButterfly } = require('./butterflies');
const { getUser, getUserRatings, createUser } = require('./users');
const rateButterfly = require('./ratebutterfly');


async function createApp(dbPath) {
  const app = express();
  app.use(express.json());

  const db = await lowdb(new FileAsync(dbPath));
  await db.read();

  // ROOT
  app.get('/', (req, res) => res.json({ message: 'Server is running!' }));

  // GET EXISTING BUTTERFLIES
  app.get('/butterflies/:id', (req, res) => getButterfly(req, res, db));

  // CREATE NEW BUTTERFLY
  app.post('/butterflies', (req, res) => createButterfly(req, res, db, shortid.generate()));

  // GET EXISTING USERS
  app.get('/users/:id', (req, res) => getUser(req, res, db));

  // CREATE NEW USER
  app.post('/users', (req, res) => createUser(req, res, db, shortid.generate()));

  // NEW FEATURES
  app.put('/leaverating/:id', (req, res) => rateButterfly(req, res, db));

  // GET EXISTING USERS RATINGS
  app.get('/users/:id/ratings', (req, res) => getUserRatings(req, res, db));


  return app;
}

/* istanbul ignore if */
if (require.main === module) {
  (async () => {
    const app = await createApp(constants.DB_PATH);
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Butterfly API started at http://localhost:${port}`);
    });
  })();
}

module.exports = createApp;
