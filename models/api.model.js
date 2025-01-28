const db = require('../db/connection');

const fetchTopics = () => {
    return db
    .query('SELECT * FROM topics;')
    .then((result) => {
        return result.rows;
    })
}

const fetchArticles = () {
    return db
    .query('SELECT * FROM articles;')
    .then((result) => {
        return result.rows
    })
}

const selectArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
        if (typeof Number(article_id) !== "number"){
            console.log("not a number")
            return Promise.reject({
                status: 400,
                msg: "Bad Request"
            })
        }
        else if (result.rows.length === 0) {
            console.log("Article_ID not found")
            return Promise.reject({
                status: 404,
                msg: "ID Not found"
            })
        } else {
            console.log("ID found")
            return result.rows;
        }
    })
}

module.exports = {selectArticleById, fetchTopics, fetchArticles};