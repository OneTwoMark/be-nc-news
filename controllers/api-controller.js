const {selectArticleById, fetchTopics, fetchArticles, fetchCommentsById, insertComment, updateArticle, fetchCommentToDelete} = require('../models/api.model')
const endpointsJson = require("../endpoints.json");

const getApi = (req, res, next) => {
   return res.status(200).send({ endpoints: endpointsJson })
}

const getTopics = (req, res, next) => {
        fetchTopics().then((topics) => {
            return res.status(200).send({topics})
        })
}

const getArticles = (req, res, next) => {
        fetchArticles().then((articles) => {
            return res.status(200).send({articles})
        })
}

const getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        console.log("Error for getArticleById")
        next(err)
    })
}

const getCommentsById = (req, res, next) => {
    const {article_id} = req.params;
    fetchCommentsById(article_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        console.log("Error for getCommentsById")
        next(err)
    })
}

const postComment = (req, res, next) => {
    const newComment = req.body;
    const {article_id} = req.params;
    insertComment(newComment, article_id).then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

const patchArticle = (req, res, next) => {
    const votes = req.body.inc_votes
    const article_id = req.params.article_id
    updateArticle(votes, article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

const deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    fetchCommentToDelete(comment_id).then((result) => {
        res.status(204).send(result)
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {
    getApi, 
    getTopics, 
    getArticleById, 
    getArticles, 
    getCommentsById, 
    postComment,
    patchArticle,
    deleteComment
};