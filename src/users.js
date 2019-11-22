const { validateUser } = require('./validators');


/* Retrieve an existing user (GET) */
const getUser = async (req, res, db) => {

  // SEARCH FOR EXISTING USER IN DB WITH GIVEN ID
  const user = await db.get('users')
    .find({ id: req.params.id })
    .value();

  if (!user) {
    return res.status(404).json({ error: 'User Not found' });
  }

  res.json(user);
};


/* Retrieve user's list of ratings (GET) */
const getUserRatings = async (req, res, db) => {

  // SEARCH FOR EXISTING USER IN DB WITH GIVEN ID
  const user = await db.get('users')
    .find({ id: req.params.id })
    .value();

  if (!user) {
    return res.status(404).json({ error: 'User Not found' });
  }

  // EXTRACT AND SORT USER'S LIST OF BUTTERFLY BY AVERAGE RATINGS
  const listOfRatings = user.listOfRatings;
  listOfRatings.sort((i, j) => i.rating - j.rating);

  res.json(listOfRatings);
};



/* Create a new user (POST) */
const createUser = async (req, res, db, generated_id) => {
  // VALIDATE BODY OF REQUEST
  try {
    validateUser(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // CREATE NEW USER OBJECT (AUTO GENERATE ID)
  const newUser = {
    id: generated_id,
    ...req.body,
    listOfRatings: []
  };

  // ADD USER OBJECT TO DB
  await db.get('users')
    .push(newUser)
    .write();

  res.json(newUser);
};


module.exports = { getUser, getUserRatings, createUser };
