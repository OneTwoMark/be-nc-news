const db = require('../db/connection');

const fetchTopics = () => {
    return db
    .query('SELECT * FROM topics;')
    .then((result) => {
        return result.rows;
    })
}

const fetchArticles = ({topic, sort_by = "created_at", order = "desc"}) => { 
    if (sort_by) {
        const greenlist = ["author", "title", "article_id", "topic", "created_at", "votes",
             "article_img_url", "comment_count"]
        if (!greenlist.includes(sort_by)) {
            return Promise.reject({
                status: 400,
                error: "Bad Request"
            })
        } 
    }

    if (order !== "desc" && order !== "asc") {
        return Promise.reject({
            status: 400,
            error: "Bad Request"
        })
    }

    let queryValues = [];
    
    let query = `SELECT 
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`

    if (topic) {
        const greenlist = ["cats", "mitch", "coding", "football", "cooking"]
        if (!greenlist.includes(topic)) {
            return Promise.reject({
                status: 400,
                error: "Bad Request"
            })
        } else {
        queryValues.push(topic)
        query += `
        WHERE topic = $1`   
        }
    }
    
    query += `
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${order}`
    
    return db
    .query(query, queryValues)
    .then((result) => {
        const articles = result.rows; 
        articles.forEach((article) => {
            article.comment_count = Number(article.comment_count)
        })
        return result.rows
    })
}

const selectArticleById = (article_id) => {
    
    let query = `      
        SELECT 
        articles.author,
        articles.body,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`


    if (typeof Number(article_id) !== "number"){
        return Promise.reject({
            status: 400,
            msg: "Bad Request"
        })
    }


    return db
    .query(query, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: "ID Not found"
            })
        }
        const article = result.rows
        article[0].comment_count = Number(article[0].comment_count)
        return article;
    })
}

const fetchCommentsById = async (article_id) => {
    const commentsResult = await db.query(`
        SELECT * FROM comments WHERE article_id = $1
        ORDER BY comments.created_at DESC`, [article_id])
        if (typeof Number(article_id) !== "number"){
            return Promise.reject({
                status: 400,
                msg: "Bad Request"
            })
        }
        if (commentsResult.rows.length === 0) {
            const articlesResult = await db.query(`
                SELECT * FROM articles WHERE article_id = $1`
            , [article_id]) 
        if (articlesResult.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: "ID Not found"
            })
        } else {
            return commentsResult.rows;
        }
    } else {
        return commentsResult.rows;
    }  
}

const insertComment = ({username, body}, article_id) => {
    return db
    .query(`INSERT INTO comments(author, body, article_id) VALUES($1, $2, $3) RETURNING *;`,
        [username, body, article_id]
    )
    .then((result) => {
        if (username, body, article_id) {
        const [commentBody] = result.rows
        return commentBody.body;
        } else {
          Promise.reject({ // err occured naturally before this manual one for 400: missing property
            staus: 400,
            msg: "Bad Request"
          })  
        }
        
    })
}

const updateArticle = (votes, id) => {
    return db
    .query(`
        UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
    [votes, id])
    .then((response) => {
        if (typeof Number(id) !== "number" || typeof Number(votes) !== "number"){
            return Promise.reject({
                status: 400,
                msg: "Bad Request"
            })
        }
        else if (response.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: "ID Not found"
            })
        } else {
            return response.rows;
        }
    })
};

const fetchCommentToDelete = (comment_id) => {
    
    if (typeof Number(comment_id) !== "number") {
        return Promise.reject({
          status: 400,
          msg: 'Bad Request'
        })
    }
    return db.query('SELECT * FROM comments WHERE comment_id = $1;', [comment_id])
    .then((selected) => { 
      if (selected.rows.length === 0 && typeof Number(comment_id) === "number") {
        return Promise.reject({
          status: 404,
          msg: 'No comments with this ID'
        })
    } else {
    return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])
    .then((result) => {
      return result.rows
      });
  }})
}

const selectUsers = () => {
    return db.query(`
        SELECT * FROM users;`).then((response) => {
            return response.rows
        })
}

module.exports = {selectArticleById, 
    fetchTopics, 
    fetchArticles, 
    fetchCommentsById, 
    insertComment,
    updateArticle,
    fetchCommentToDelete,
    selectUsers
};