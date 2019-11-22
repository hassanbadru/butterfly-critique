const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');
const request = require('supertest');
const shortid = require('shortid');

const createApp = require('../src/index');
const { getUser, getUserRatings, createUser } = require('../src/users');

let app, db;


beforeAll(async () => {
  const testDbPath = path.join(__dirname, 'test.db.json');
  // Create an app instance
  app = await createApp(testDbPath);

  const db = await lowdb(new FileAsync(testDbPath));
  await db.read();
});


// RETRIEVING USER DETAILS
describe('GET user', () => {
  // TEST CODE IF USER EXISTS IN DATABASE
  it('success', async () => {
    const response = await request(app)
      .get('/users/abcd1234', (req, res) => getUser(req, res, db));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'abcd1234',
      username: 'test-user',
      listOfRatings: [
        {
          id: 'xwzy8967',
          commonName: 'butterfly-test',
          species: 'Butterflius Testium',
          article: 'https://example.com/butterflius_testium',
          rating: '3.0',
          numOfRatings: 1
        },
        {
          id: 'wxyz9876',
          commonName: 'test-butterfly',
          species: 'Testium butterflius',
          article: 'https://example.com/testium_butterflius',
          rating: '4.0',
          numOfRatings: 1
        }

      ]
    });
  });

  // TEST CODE IF USER ISN'T FOUND IN DATABASE
  it('error - not found', async () => {
    const response = await request(app)
      .get('/users/bad-id', (req, res) => getUser(req, res, db));

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'User Not found'
    });
  });
});


// RETRIEVING USER'S PAST RATINGS
describe('GET userratings', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/users/abcd1234/ratings', (req, res) => getUserRatings(req, res, db));

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      [
        {
          id: 'xwzy8967',
          commonName: 'butterfly-test',
          species: 'Butterflius Testium',
          article: 'https://example.com/butterflius_testium',
          rating: '3.0',
          numOfRatings: 1
        },
        {
          id: 'wxyz9876',
          commonName: 'test-butterfly',
          species: 'Testium butterflius',
          article: 'https://example.com/testium_butterflius',
          rating: '4.0',
          numOfRatings: 1
        }
      ]
    );
  });

  // TEST CODE IF USER DOESN'T EXIST IN DATABASE
  it('error - not found', async () => {
    const response = await request(app)
      .get('/users/bad-id/ratings', (req, res) => getUserRatings(req, res, db));

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'User Not found'
    });
  });
});


// ADDING A NEW USERS
describe('POST user', () => {
  // TEST CODE IF NEW USER IS CREATED
  it('success', async () => {
    shortid.generate = jest.fn().mockReturnValue('new-user-id');

    const postResponse = await request(app)
      .post('/users', (req, res) => createUser(req, res, db, shortid.generate))
      .send({
        username: 'Buster'
      });

    expect(postResponse.status).toBe(200);
    expect(postResponse.body).toEqual({
      id: 'new-user-id',
      username: 'Buster',
      listOfRatings: []
    });

    const getResponse = await request(app)
      .get('/users/new-user-id', (req, res) => getUser(req, res, db));

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      id: 'new-user-id',
      username: 'Buster',
      listOfRatings: []
    });
  });

  // TEST CODE IF REQUEST BODY IS EMPTY
  it('error - empty body', async () => {
    const response = await request(app)
      .post('/users', (req, res) => createUser(req, res, db, null))
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  // TEST CODE IF BODY OF REQUEST IS MISSING
  it('error - missing all attributes', async () => {
    const response = await request(app)
      .post('/users', (req, res) => createUser(req, res, db, null))
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });
});
