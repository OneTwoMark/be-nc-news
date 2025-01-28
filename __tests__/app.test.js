const endpointsJson = require("../endpoints.json");
const app = require ('../app.js')
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db//seeds/seed.js');
const testData = require('../db/data/test-data')
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(testData));
afterAll(() => db.end())

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
  test('should have slug and description properties & of type string', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then((response) => {
      response.body.topics.forEach((topic) => {
        expect(typeof topic.slug).toBe('string')
        expect(typeof topic.description).toBe('string')
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
      console.log(response.body.article)
      expect(typeof response.body.article).toBe("object")
    })
  });
  test('200: should respond with an article by its id', () => {
    const article = [{
    article_id: 1,
    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    author: "butter_bridge",
    body: "I find this existence challenging",
    created_at: "2020-07-09T20:11:00.000Z",
    title: "Living in the shadow of a great man",
    topic: "mitch",
    votes: 100,
    }]
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((response) => {
      expect(response.body.article).toEqual(article)
    })
  });
  test('object should return correct amount of properties', () => {
    return request(app)
    .get('/api/articles/2')
    .expect(200)
    .then((response) => {
      const [article] = response.body.article;
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

describe('GET /api/articles', () => {
  test('should respond with an array of article objects', () => {
    return request(app)
    .get('/api/articles')
  });
});