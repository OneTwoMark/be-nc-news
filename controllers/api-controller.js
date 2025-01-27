const {selectEndpoints} = require('../models/api.model')
const endpointsJson = require("../endpoints.json");

getApi = (req, res, next) => {
    console.log(endpointsJson)
   return res.status(200).send({ endpoints: endpointsJson })
}


module.exports = getApi;