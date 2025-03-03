const express = require("express")
const app = express()
const {getApi, getTopics, getArticleById, getArticles, getCommentsById, postComment, patchArticle, deleteComment, getUsers} = require('./controllers/api-controller.js')
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/api', getApi)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsById)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', deleteComment)

app.get('/api/users', getUsers)

app.all('*', (req, res) => {
    return res.status(404).send({error: "Endpoint not found"})
})

app.use((err, req, res, next) => {
    if (err.status === 404) {
        return res.status(404).send(err)
    }
    else next(err)
})

app.use((err, req, res, next) => {
    if (err.status === 400 || err.code === "22P02" || err.code === "23502") {
        return res.status(400).send({error: "Bad Request"})
    }
    else next(err)
})

app.use((err, req, res, next) => {
    return res.status(500).send({error: "Internal Server Error"})
})


module.exports = app;