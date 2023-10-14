const express = require("express")

const userRouter = require('./user')
const urlRouter = require('./url')


module.exports = (config) => {
    const router = express.Router()

    router.use('/user', userRouter(config))
    router.use('/url', urlRouter(config))

    return router;
} 