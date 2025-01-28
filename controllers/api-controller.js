const {selectArticleById, fetchTopics, fetchArticles} = require('../models/api.model')
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
module.exports = {getApi, getTopics, getArticleById, getArticles};