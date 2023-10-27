const express = require("express")
const UrlServices = require("../../services/urls")

module.exports = (config) => {
    const router = express.Router()

    const { createShortUrl, getLongUrl, redirectTo, getShortUrlStats, urlsList } = UrlServices(config)

    router
        .post("/", createShortUrl)
        .get('/:shortUrl', redirectTo)
        .get("/url-details/:shortUrl", getLongUrl)
        .get('/url-details/:shortUrl/stats', getShortUrlStats)
        .get('/list/', urlsList)

    return router
}