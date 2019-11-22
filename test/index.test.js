const path = require('path');
const request = require('supertest');
const createApp = require('../src/index');

let app;

beforeAll(async () => {
  const testDbPath = path.join(__dirname, 'test.db.json');
  // Create an app instance
  app = await createApp(testDbPath);
});

// TESTING ROOT ROUTE
describe('GET root', () => {
  test('success', async () => {
    const response = await request(app)
      .get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Server is running!' });
  });
});
