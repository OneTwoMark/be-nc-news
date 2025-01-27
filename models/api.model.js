const db = require('../db/connection');
const endpointsJSON = require("../endpoints.json");

selectEndpoints = () => {
    return Promise.resolve(endpointsJSON)     
}

module.exports = {selectEndpoints};