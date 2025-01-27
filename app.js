const express = require("express")
const app = express()
const {getApi, getTopics} = require('./controllers/api-controller.js')
const testData = require('./db/data/test-data')

app.use(express.json());

app.get('/api', getApi)

app.get('/api/topics', getTopics)


// look into app.all(/*)


app.all('*', (req, res) => {
    console.log("Error: 404")
    res.status(404).send({error: "Endpoint not found"})
})

app.use((err, req, res, next) => {
    console.log("This is error handling block 1")
    console.log("Error code: ", err.code)
})

app.use((err, req, res, next) => {
    console.log("Error: 500")
    console.log("Error code: ", err.code)
    res.status(500).send({error: "Internal Server Error"})
})


module.exports = app;