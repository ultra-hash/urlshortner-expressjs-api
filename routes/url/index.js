const express = require("express")

module.exports = (config) => {
    const router = express.Router()

    router.get("/", (req, res) => {
        res.send("Url Router")
    })

    return router
}