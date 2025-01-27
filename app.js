const express = require("express")
const app = express()
const getApi = require('./controllers/api-controller.js')

app.use(express.json());

app.get('/api', getApi)

app.use((err, req, res, next) => {
    console.log("This is error handling block 1")
})

module.exports = app;