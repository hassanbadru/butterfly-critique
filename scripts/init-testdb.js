const fs = require('fs');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');


async function init() {

  const testDbPath = path.join(__dirname, '../test/test.db.json');

  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  const db = await lowdb(new FileAsync(testDbPath));

  await db.defaults({
    butterflies: [
      { id: 'wxyz9876', commonName: 'test-butterfly', species: 'Testium butterflius', article: 'https://example.com/testium_butterflius', rating: '4.0', numOfRatings: 1 },
      { id: 'xwzy8967', commonName: 'butterfly-test', species: 'Butterflius Testium', article: 'https://example.com/butterflius_testium', rating: '3.0', numOfRatings: 1 },
      { id: 'old-butterfly-id', commonName: 'Boop1', species: 'Boopi beepi1', article: 'https://example.com/boopi_beepi1', rating: '4.0', numOfRatings: 0 },
      { id: 'zero-butterfly-id', commonName: 'Boop0', species: 'Boopi beepi0', article: 'https://example.com/boopi_beepi0', rating: '0.0', numOfRatings: 0 }
    ],
    users: [
      { id: 'abcd1234', username: 'test-user', listOfRatings: [
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
      },
      { id: 'zero-user-id', username: 'ZeroBuster', listOfRatings: [] },
      { id: 'old-user-id', username: 'NotBuster', listOfRatings: [] }
    ]
  }).write();
}

if (require.main === module) {
  (async () => await init())();
}
