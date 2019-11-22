# 🦋 Butterfly critique

Butterfly critique is an API designed for butterfly enthusiasts. So far, it's an [`express`](https://expressjs.com/)-based API that stores butterflies and users.

Data persistence is through a JSON-powered database called [`lowdb`](https://github.com/typicode/lowdb).

Validation is built using an assertion library called [`@mapbox/fusspot`](https://github.com/mapbox/fusspot).

## Task

Butterfly critique is already a pretty great API, but we think it would be even better if it let users critique butterflies. Your task is to create new API endpoints that:

1. Allow a user to rate butterflies on a scale of 0 through 5
1. Allow retrieval of a list of a user's rated butterflies, sorted by rating

You should also provide a small **write-up** that explains the decisions (for instance, the HTTP verbs for new endpoints) and trade-offs you made. If you add any new dependencies, spend some time talking about why you chose them.

You are free to refactor or improve any code you think should be refactored, but please include a note about such changes in your write-up.

If you have any questions or concerns, please do not hesitate to contact us!

### What we're looking for

* Your code should be extensible and reusable
* Your code should be well tested
* Your code should be tidy and adhere to conventions
* Your write-up should be thoughtful and coherent

### Scoring rubric

You will be scored on the following aspects of your work:

* Endpoint implementation
* Endpoint design
* Appropriate testing of new code
* Tidiness and adherence to conventions
* Appropriate refactoring
* Technical proficiency
* Communication in the write-up

0 = poor 1 = adequate 2 = exceptional

The maximum possible score is 14.

## Developing

### Requirements

* Node v10.15.x
* npm v6

### Setup

Install dependencies with:

```sh
npm install
```

If you need to recreate the butterflies database, you can run:

```sh
npm run init-db
```

### Running

To run the application locally:

```sh
npm start
```

You should see a message that the application has started:

```sh
Butterfly API started at http://localhost:8000
```

You can manually try out the application using `curl`:

```sh
# GET a butterfly
curl http://localhost:8000/butterflies/xRKSdjkBt4

# POST a new butterfly
curl -X POST -d '{"commonName":"Brimstone", "species":"Gonepteryx rhamni", "article":"https://en.wikipedia.org/wiki/Gonepteryx_rhamni"}' -H 'content-type: application/json' http://localhost:8000/butterflies

# GET a user
curl http://localhost:8000/users/OOWzUaHLsK
```

**For developing**, you can run the application with auto-restarts on code changes using:

```sh
npm run watch
```

### Testing

This project uses [`jest`](https://jestjs.io/) as its testing framework.
If you are unfamiliar with `jest`, check out its [documentation](https://jestjs.io/docs/en/getting-started).

This project has `eslint` and a custom config [`@mapbox/eslint-config-mapbox`](https://www.npmjs.com/package/@mapbox/eslint-config-mapbox) setup for code linting.

To run the linter and all tests:

```sh
npm test
```

**For developing**, you can run `jest` with auto-restarts using:

```sh
npm run test-watch
```
