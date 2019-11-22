const path = require('path');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const request = require('supertest');
const shortid = require('shortid');
const createApp = require('../src/index');

const { getButterfly, createButterfly } = require('../src/butterflies');

let app, db;


beforeAll(async () => {
  const testDbPath = path.join(__dirname, 'test.db.json');
  // Create an app instance
  app = await createApp(testDbPath);

  const db = await lowdb(new FileAsync(testDbPath));
  await db.read();
});


// RETRIEVE EXISTING BUTTERFLY
describe('GET butterfly', () => {
// TEST CODE THAT RETRIEVES EXISTING BUTTERFLY
  it('success', async () => {
    const response = await request(app)
      .get('/butterflies/wxyz9876', (req, res) => getButterfly(req, res, db));
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'wxyz9876',
      commonName: 'test-butterfly',
      species: 'Testium butterflius',
      article: 'https://example.com/testium_butterflius',
      numOfRatings: 1,
      rating: '4.0'
    });
  });

  // TEST CODE IF BUTTERFLY WITH SUCH ID DOESN'T EXIST
  it('error - not found', async () => {
    const response = await request(app)
      .get('/butterflies/bad-id', (req, res) => getButterfly(req, res, db));
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Butterfly Not found'
    });
  });
});


// ADDING BUTTERFLY
describe('POST butterfly', () => {
  // TEST CODE TO ADD NEW BUTTERFLY
  it('success', async () => {
    shortid.generate = jest.fn().mockReturnValue('new-butterfly-id');

    const postResponse = await request(app)
      .post('/butterflies', (req, res) => createButterfly(req, res, db, shortid.generate))
      .send({
        commonName: 'Boop',
        species: 'Boopi beepi',
        article: 'https://example.com/boopi_beepi'
      });

    expect(postResponse.status).toBe(200);
    expect(postResponse.body).toEqual({
      id: 'new-butterfly-id',
      commonName: 'Boop',
      species: 'Boopi beepi',
      article: 'https://example.com/boopi_beepi',
      rating: '0.0',
      numOfRatings: 0
    });
  });

  // TEST CODE IF BODY OF REQUEST IS EMPTY
  it('error - empty body', async () => {
    const response = await request(app)
      .post('/butterflies', (req, res) => createButterfly(req, res, db, null))
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  // TEST CODE IF BODY OF REQUEST ISN'T VALID
  it('error - missing all attributes', async () => {
    const response = await request(app)
      .post('/butterflies', (req, res) => createButterfly(req, res, db, null))
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  // TEST CODE IF BODY OF REQUEST IS INCOMPLETE
  it('error - missing some attributes', async () => {
    const response = await request(app)
      .post('/butterflies', (req, res) => createButterfly(req, res, db, null))
      .send({ commonName: 'boop' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });
});
