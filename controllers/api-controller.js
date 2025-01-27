const {selectEndpoints, formatTopics} = require('../models/api.model')
const endpointsJson = require("../endpoints.json");
const testData = require('../db/data/test-data')

getApi = (req, res, next) => {
   return res.status(200).send({ endpoints: endpointsJson })
}

getTopics = (req, res, next) => {
    return res.status(200).send(testData.topicData)
}

module.exports = {getApi, getTopics};