const { validateButterfly } = require('./validators');



/* ----- BUTTERFLIES ----- */
/* Retrieve an existing butterfly (GET) */
const getButterfly = async (req, res, db) => {

  // SEARCH FOR BUTTERFLY IN DB WITH GIVEN ID
  const butterfly = await db.get('butterflies')
    .find({ id: req.params.id })
    .value();

  if (!butterfly) {
    return res.status(404).json({ error: 'Butterfly Not found' });
  }

  return res.json(butterfly);
};




/* Create a new butterfly (POST) */
const createButterfly = async (req, res, db, generated_id) => {

  // VALIDATE BODY OF REQUEST
  try {
    validateButterfly(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // CREATE NEW BUTTERFLY OBJECT (AUTO GENERATE ID)
  const newButterfly = {
    id: generated_id,
    ...req.body,
    rating: '0.0',
    numOfRatings: 0
  };

  // ADD BUTTERFLY OBJECT TO DB
  await db.get('butterflies')
    .push(newButterfly)
    .write();

  res.json(newButterfly);
};


module.exports = { getButterfly, createButterfly };
