const express = require("express")
const UrlServices = require("../../services/urls")

module.exports = (config) => {
    const router = express.Router()

    const { createShortUrl, getLongUrl, redirectTo } = UrlServices(config)

    router
        .post("/", createShortUrl)
        .get('/:shortUrl', redirectTo)
        .get("/url-details/:shortUrl", getLongUrl)

    return router
}