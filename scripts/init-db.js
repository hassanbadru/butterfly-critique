const fs = require('fs');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const constants = require('../src/constants');

async function init() {
  if (fs.existsSync(constants.DB_PATH)) {
    fs.unlinkSync(constants.DB_PATH);
  }

  const db = await lowdb(new FileAsync(constants.DB_PATH));

  await db.defaults({
    butterflies: [
      { id: 'GI9_EuH8s1', commonName: 'Zebra Swallowtail', species: 'Protographium marcellus', article: 'https://en.wikipedia.org/wiki/Protographium_marcellus', rating: 0, numOfRatings: 0 },
      { id: 'xRKSdjkBt4', commonName: 'Plum Judy', species: 'Abisara echerius', article: 'https://en.wikipedia.org/wiki/Abisara_echerius', rating: 0, numOfRatings: 0 },
      { id: '0MUBKMu07U', commonName: 'Red Pierrot', species: 'Talicada nyseus', article: 'https://en.wikipedia.org/wiki/Talicada_nyseus', rating: 0, numOfRatings: 0 },
      { id: 'NLktii5zvK', commonName: 'Texan Crescentspot', species: 'Anthanassa texana', article: 'https://en.wikipedia.org/wiki/Anthanassa_texana', rating: 0, numOfRatings: 0 },
      { id: 'SMyaT24g-N', commonName: 'Guava Skipper', species: 'Phocides polybius', article: 'https://en.wikipedia.org/wiki/Phocides_polybius', rating: 0, numOfRatings: 0 },
      { id: 'DCenP4kQNQ', commonName: 'Mexican Bluewing', species: 'Myscelia ethusa', article: 'https://en.wikipedia.org/wiki/Myscelia_ethusa', rating: 0, numOfRatings: 0 }
    ],
    users: [
      { id: 'OOWzUaHLsK', username: 'iluvbutterflies', listOfRatings: [] },
      { id: 'sdmU7-wkQX', username: 'flutterby', listOfRatings: [] },
      { id: 'aqekk3t4kw', username: 'metamorphosize_me', listOfRatings: [] }
    ]
  }).write();
}

if (require.main === module) {
  (async () => await init())();
}
