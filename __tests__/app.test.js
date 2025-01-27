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
  })
})

describe('GET /api/articles/:article_id', () => {
  test('200: should respond with an object', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((response) => {
      expect(typeof response.body[0]).toBe("object")
    })
  });
  test('200: should respond with an article by its id', () => {
    const article = {
      article_id: 1,
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: '2020-11-07T06:03:00.000Z',
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700'
    }
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((response) => {
      expect(response.body[0]).toEqual(article)
    })
  });
  test('object should return correct amount of properties', () => {
    return request(app)
    .get('/api/articles/2')
    .expect(200)
    .then((response) => {
      const article = response.body[0]
      expect(article).toHaveProperty('author')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('article_id')
      expect(article).toHaveProperty('body')
      expect(article).toHaveProperty('topic')
      expect(article).toHaveProperty('created_at')
      expect(article).toHaveProperty('votes')
      expect(article).toHaveProperty('article_img_url')
    })
  });
  test('404: ID not found', () => {
    return request(app)
    .get('/api/articles/9999')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("ID Not found")
    })
  });
  test('400: Invalid endpoint', () => {
    return request(app)
    .get('/api/articles/hello')
    .expect(400)
    .then((response) => {
      expect(response.body).toEqual({"error": "Bad Request"})
    })
  });
});
