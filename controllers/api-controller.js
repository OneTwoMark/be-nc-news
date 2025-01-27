const {selectArticleById} = require('../models/api.model')
const endpointsJson = require("../endpoints.json");
const testData = require('../db/data/test-data')

getApi = (req, res, next) => {
   return res.status(200).send({ endpoints: endpointsJson })
}

getTopics = (req, res, next) => {
    return res.status(200).send(testData.topicData)
}

getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        console.log("Error for getArticleById")
        next(err)
    })
}
module.exports = {getApi, getTopics, getArticleById};