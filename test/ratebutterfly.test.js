const path = require('path');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const request = require('supertest');

const createApp = require('../src/index');
const rateButterfly = require('../src/ratebutterfly');

let app, db;


beforeAll(async () => {
  const testDbPath = path.join(__dirname, 'test.db.json');
  // Create an app instance
  app = await createApp(testDbPath);

  const db = await lowdb(new FileAsync(testDbPath));
  await db.read();
});


// ADDING NEW RATING
describe('PUT rateButterfly', () => {
  // TEST CODE IF BUTTERFLY RATING IS VALID
  it('success', async () => {
    const postResponse = await request(app)
      .put('/leaverating/old-butterfly-id', (req, res) => rateButterfly(req, res, db))
      .send({
        userId: 'old-user-id',
        rating: 4
      });

    expect(postResponse.status).toBe(200);
    expect(postResponse.body).toEqual({
      id: 'old-butterfly-id',
      commonName: 'Boop1',
      species: 'Boopi beepi1',
      article: 'https://example.com/boopi_beepi1',
      rating: '4.0',
      numOfRatings: 1,
      reviewer: 'NotBuster'
    });

  });

  // TEST CODE IF USER ALREADY LEFT A RATING FOR SPECIFIC BUTTERFLY
  it('error - user already left rating', async () => {
    const response = await request(app)
      .put('/leaverating/wxyz9876', (req, res) => rateButterfly(req, res, db))
      .send({
        userId: 'abcd1234',
        rating: 4
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'This User already rated this butterfly'
    });
  });

  // TEST CODE IF BODY OF REQUEST IS EMPTY
  it('error - empty body', async () => {
    const response = await request(app)
      .put('/leaverating/old-butterfly-id', (req, res) => rateButterfly(req, res, db))
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  // TEST CODE IF NEW BUTTERFLY RATING IS OUT OF RANGE
  it('error - rating is out of range', async () => {
    const response = await request(app)
      .put('/leaverating/old-butterfly-id', (req, res) => rateButterfly(req, res, db))
      .send({
        userId: 'old-user-id',
        rating: 8
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid rating (should be of range 0 - 5)'
    });
  });

  // TEST CODE IF USER LEAVING RATING DOESN'T EXIST
  it('error - rating user not found', async () => {
    const response = await request(app)
      .put('/leaverating/old-butterfly-id', (req, res) => rateButterfly(req, res, db))
      .send({
        userId: 'bad-id',
        rating: 3
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'User Not found'
    });
  });

  // TEST CODE IF BUTTERFLY DOESN'T EXIST IN DATABASE
  it('error - butterfly not found', async () => {
    const response = await request(app)
      .put('/leaverating/bad-id', (req, res) => rateButterfly(req, res, db))
      .send({
        userId: 'old-user-id',
        rating: 4
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Butterfly Not found'
    });
  });
});
