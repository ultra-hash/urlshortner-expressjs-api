const express = require("express")
const config = require("./config")
const { connectionToMySQL } = require('./db/connection')
const routes = require('./routes')

// connection to db
const mysqlClient = connectionToMySQL(config)
config.mysql.client = mysqlClient

// init express
const app = express()

// init middleware
app.use(express.json())

// Routes
app.use('/', routes(config))

app.get('/', (req, res) => {
    res.send("Hello world")
})

// start server
app.listen(3000, () => {
    console.info("started at localhost:3000")
})
