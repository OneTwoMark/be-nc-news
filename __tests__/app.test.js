const endpointsJson = require("../endpoints.json");
const app = require ('../app.js')
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db//seeds/seed.js');
const testData = require('../db/data/test-data')
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
// beforeEach(() => seed());
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

describe('GET /api/topics', () => {
  test('200: Responds with array of topic objects', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(testData.topicData)
    })
  });
  test('should have slug and description properties', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then((response) => {
      response.body.forEach((topic) => {
        expect(topic).toHaveProperty('slug')
        expect(topic).toHaveProperty('description')
      })
    })
  });
  test('404: responds with error when endpoint not found', () => {
    return request(app)
    .get('/api/hello')
    .expect(404)
    .then((response) => {
      expect(response.body).toEqual({"error": "Endpoint not found"})
  })
})})
