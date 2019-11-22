const v = require('@mapbox/fusspot');

// ASSERT BUTTERFLY FORMAT
const validateButterfly = v.assert(
  v.strictShape({
    commonName: v.required(v.string),
    species: v.required(v.string),
    article: v.required(v.string)
  })
);


// ASSERT USER FORMAT
const validateUser = v.assert(
  v.strictShape({
    username: v.required(v.string)
  })
);


// ASSERT RATING FORMAT
const validateRating = v.assert(
  v.strictShape({
    userId: v.required(v.string),
    rating: v.required(v.number)
  })
);


module.exports = { validateButterfly, validateUser, validateRating };
