const endpointsJson = require("../endpoints.json");
const app = require ('../app.js')
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db//seeds/seed.js');
const testData = require('../db/data/test-data')
const {toBeSorted} = require('jest-sorted');

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
  test('200 should respond with an array of article objects', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
      response.body.articles.forEach((article) => {
        expect(typeof article).toBe("object")
      }) 
      expect(Array.isArray(response.body.articles)).toBe(true)
    })
    })
    test('200 should return correct properties', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
      const [article] = response.body.articles;
      expect(article).toHaveProperty('author')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('article_id')
      expect(article).toHaveProperty('topic')
      expect(article).toHaveProperty('created_at')
      expect(article).toHaveProperty('votes')
      expect(article).toHaveProperty('article_img_url')
      expect(article).toHaveProperty('comment_count')
      expect(article).not.toHaveProperty('body')
    })
    });
    test('should be sorted by date in descending order', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        const dates = articles.map((article) => {
         return new Date(article.created_at)
        })
        for (let i = 0; i < articles.length - 1; i++) {
          expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i+1].getTime())
        }
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
    test('200 should take sort by and order queries and respond', () => {
      return request(app)
      .get('/api/articles?sort_by=title&order=asc')
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        const sortedTitles = articles.map((article) => {
        return article.title
      })
        expect(sortedTitles).toBeSorted({ascending: true})
      })
    });
    test('400 should respond with error if given invalid sort by', () => {
      return request(app)
      .get('/api/articles?sort_by=dogs&order=asc')
      .expect(400)
      .then((response) => {
        const error = response.body
        expect(error.error).toBe("Bad Request")
      })
    });
    test('400 should respond with error if given invalid order', () => {
      return request(app)
      .get('/api/articles?sort_by=title&order=abc')
      .expect(400)
      .then((response) => {
        const error = response.body
        expect(error.error).toBe("Bad Request")
    });
  });
})

  describe('GET /api/articles/:article_id/comments', () => {
    test('should return an array of objects', () => {
      return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then((response) => {
        response.body.comments.forEach((comment) => {
          expect(typeof comment).toBe("object")
        }) 
        
        expect(Array.isArray(response.body.comments)).toBe(true)
      })
      })
    test('200 responds with empty array when fetching an article with no associated comments', () => {
      return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then((response) => {
        const comments = response.body.comments
        console.log(comments)
        expect(comments).toEqual([]) 
        })
      })
    test('should get all comments for only specific article ID.', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      const comments = response.body.comments;
      for (let i = 0; i < comments.length -1; i++) {
        expect(comments[i].article_id).toEqual(comments[i+1].article_id)
      }
    })
    });
    test('should return the correct comments properties', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      const [comments] = response.body.comments;
      expect(comments).toHaveProperty('author')
      expect(comments).toHaveProperty('comment_id')
      expect(comments).toHaveProperty('created_at')
      expect(comments).toHaveProperty('votes')
      expect(comments).toHaveProperty('body')
    })
    });
    test('should return most recent comments first', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      const comments = response.body.comments;
      const sortedComments = comments.map((comment) => {
        return comment.created_at
      })
      expect(sortedComments).toBeSorted({descending: true})
    })
    });
    test('404: responds with error when endpoint not found', () => {
    return request(app)
    .get('/api/articles/1/dogs')
    .expect(404)
    .then((response) => {
      expect(response.body).toEqual({"error": "Endpoint not found"})
    })
    });
    test('400: should return bad request for invalid ID', () => {
    return request(app)
    .get('/api/articles/99-.9/comments')
    .expect(400)
    .then((response) => {
      expect(response.body).toEqual({"error": "Bad Request"})
    })
    });
  });

  describe('POST /api/articles/:article_id/comments', () => {
    test('201 should respond with comment object, with username and body properties', () => {
      const newComment = {
        username: "lurker",
        body: "Now comes the part where we throw our heads back and laugh"
      }
      return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then((response) => {
      const commentResponse = response.body.comment;
      console.log(response.body)
      expect(newComment.body).toEqual(commentResponse);
      });
    });
    test('400 should respond with error if provided with missing properties ', () => {
      const newComment = {
        body: "Now comes the part where we throw our heads back and laugh"
      }
      return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
      const {error} = response.body
      expect(error).toEqual("Bad Request"); 
      })
    });
    test('401 should respond with error if provided endpoint that doesnt exist ', () => {
      const newComment = {
        username: "lurker",
        body: "Now comes the part where we throw our heads back and laugh"
      }
      return request(app)
      .post('/api/articles/1/commentz!')
      .send(newComment)
      .expect(404)
      .then((response) => {
      const {error} = response.body
      expect(error).toEqual("Endpoint not found"); 
      })
    });
  });

  describe('PATCH /api/articles/:article_id', () => {
    test('should respond with an article with correct properties', () => {
      const newVotes = {inc_votes: 50}
      return request(app)
      .patch('/api/articles/1')
      .send(newVotes)
      .expect(200)
        .then((response) => {
          const [article] = (response.body.article)
          expect(article).toHaveProperty('article_id')
          expect(article).toHaveProperty('title')
          expect(article).toHaveProperty('topic')
          expect(article).toHaveProperty('author')
          expect(article).toHaveProperty('body')
          expect(article).toHaveProperty('created_at')
          expect(article).toHaveProperty('votes')
          expect(article).toHaveProperty('article_img_url')
        })
    });
    test('200 should patch only article of ID specified', () => {
      const newVotes = {inc_votes: 50}
      return request(app)
      .patch('/api/articles/1')
      .send(newVotes)
      .expect(200)
        .then((response) => {
          const [article] = response.body.article;
          expect(article.article_id).toBe(1)
        })
      })
      test('200 should increment the vote by amount specified', async () => {
        const beforePatchQuery = await db.query(`
          SELECT * FROM articles
          WHERE article_id = 1
          `)
        const [beforePatch] = beforePatchQuery.rows
      const newVotes = {inc_votes: 50}
      const response = await request(app)
      .patch('/api/articles/1')
      .send(newVotes)
      .expect(200)
          const [afterPatch] = response.body.article;
          expect(beforePatch.votes).toBe(100)
          expect(afterPatch.votes).toBe(150)
      });
      test('404 should return error if ID not found', () => {
        const newVotes = {inc_votes: 50}
        return request(app)
        .patch('/api/articles/999')
        .send(newVotes)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("ID Not found")
        })
      });
      test('404 should return error for valid ID but missing directory', () => {
        const newVotes = {inc_votes: 50}
        return request(app)
        .patch('/api/articlezzz/1')
        .send(newVotes)
        .expect(404)
        .then((response) => {
          expect(response.body.error).toEqual("Endpoint not found")
        })
      });
      test('400 should return error for invalid votes type', () => {
        const newVotes = {inc_votes: "over 9000"}
        return request(app)
        .patch('/api/articles/1')
        .send(newVotes)
        .expect(400)
        .then((response) => {
          expect(response.body.error).toEqual("Bad Request")
        })
      });
    });

    describe('DELETE /api/comments/:comment_id', () => {
      test('204 should delete the given comment by comment id', () => {
        return request(app)
        .delete('/api/comments/3')
        .expect(204);
      });
      test('404 responds with an appropriate status and error message when given a non-existent comment', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe('No comments with this ID');
      });
      });
      test('400 responds with an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .delete('/api/comments/not-an-id')
        .expect(400)
        .then((response) => {
          console.log(response.body)
        expect(response.body.error).toBe('Bad Request');
      });
      });
    });

    describe('GET /api/users', () => {
      test('200 should respond with array of objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
          const users = response.body
          users.forEach((user) => {
            expect(typeof user).toBe("object")
          }) 
          
          expect(Array.isArray(users)).toBe(true)
        })
      });
      test('200 checks for correct properties and of correct type', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
          const users = response.body
          users.forEach((user) => {
            expect(typeof user.username).toBe('string')
            expect(typeof user.name).toBe('string')
            expect(typeof user.avatar_url).toBe('string')
          }) 
      });
    });
    test('200 should check response is not empty', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
          const users = response.body
          expect(Array.isArray(users)).toBe(true)
          expect(users.length).toBeGreaterThan(0)
        })
    });
  })