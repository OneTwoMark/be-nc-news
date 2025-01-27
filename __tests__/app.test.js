const endpointsJson = require("../endpoints.json");
const app = require ('../app.js')
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db//seeds/seed.js');
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
// beforeEach(() => seed({endpointsJson}));
// afterAll(() => db.end())

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
