const express = require("express")
const UrlServices = require("../../services/urls")
const { verifyJwtToken } = require("../../middleware/auth")


module.exports = (config) => {
    const router = express.Router()

    const { createShortUrl, getLongUrl, redirectTo, getShortUrlStats, urlsList } = UrlServices(config)

    router
        .post("/create", verifyJwtToken, createShortUrl)
        .get('/redirect/:shortUrl', redirectTo)
        .get("/details/:shortUrl", getLongUrl)
        .get('/details/:shortUrl/stats', getShortUrlStats)
        .get('/list/', urlsList)

    return router
}