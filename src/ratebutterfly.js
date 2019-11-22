const { validateRating } = require('./validators');


/* User Rate Butterfly */
const rateButterfly = async (req, res, db) => {

  try {
    // VALIDATE BODY OF REQUEST
    validateRating(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }


  // GET BUTTERFLY WITH GIVEN ID FROM DB
  const butterfly = await db.get('butterflies')
    .find({ id: req.params.id })
    .value();

  if (!butterfly) {
    // IF BUTTERFLY WITH GIVEN ID ISN'T FOUND
    return res.status(404).json({ error: 'Butterfly Not found' });
  }

  // EXTRACT NEW AND EXISTING RATINGS DETAILS
  const newRating = req.body.rating;
  const currentRating = butterfly.rating;
  let numOfRatings = butterfly.numOfRatings;
  let avgRating;

  // CHECK IF RANGE OF NEW RATING IS BETWEEN 0 AND 5
  if (newRating >= 0 && newRating <= 5){
    // NEW BUTTERLY RATING
    if (numOfRatings > 0){
      const sumOfAllRatings = currentRating * numOfRatings; // CALCULATE SUM OF ALL RATINGS
      numOfRatings += 1; // INCREMENT NUMBER OF RATINGS
      avgRating = (sumOfAllRatings + newRating) / numOfRatings; // CALCULATE NEW AVERAGE
    } else {
      numOfRatings += 1; // INCREMENT NUMBER OF RATINGS
      avgRating = newRating; // CALCULATE NEW AVERAGE
    }

  } else {
    // IF RANGE OF RATING IS NOT BETWEEN 0 AND 5
    return res.status(400).json({ error: 'Invalid rating (should be of range 0 - 5)' });
  }

  // CREATE BUTTERFLY OBJECT INSTANCE WITH UPDATED RATING
  const updatedButterfly = {
    ...butterfly,
    rating: avgRating.toFixed(1),
    numOfRatings: numOfRatings
  };

  // ADD LIST OF RATED BUTTERFLY FOR USER
  const currentUser = await db.get('users')
    .find({ id: req.body.userId })
    .value();

  if (!currentUser) {
    // IF USER WITH GIVEN ID ISN'T FOUND
    return res.status(404).json({ error: 'User Not found' });
  }

  // EXTRACT AND UPDATE USER-RATED BUTTERFLY LIST
  const listOfRatings = currentUser.listOfRatings;
  const alreadyRated = listOfRatings.some((element) => element.id === updatedButterfly.id);

  if (alreadyRated){
    return res.status(400).json({ error: 'This User already rated this butterfly' });
  } else {
    listOfRatings.push({ ...updatedButterfly, rating: newRating.toFixed(1) });
  }


  // ADD UPDATED BUTTERFLY RATING TO DB
  await db.get('butterflies')
    .find({ id: updatedButterfly.id })
    .assign(updatedButterfly)
    .write();


  // CREATE BUTTERFLY OBJECT INSTANCE WITH UPDATED RATING
  const updatedUser = {
    ...currentUser,
    listOfRatings: listOfRatings
  };

  // ADD UPDATED USER RATING TO DB
  await db.get('users')
    .find({ id: currentUser.id })
    .assign(updatedUser)
    .write();


  res.json({ ...updatedButterfly, reviewer: updatedUser.username });
};

module.exports = rateButterfly;
