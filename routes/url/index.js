const express = require("express")
const UrlServices = require("../../services/UrlServices")

module.exports = (config) => {
    const router = express.Router()

    const { createShortUrl, getLongUrl } = UrlServices(config)

    router.post("/", async (req, res) => {
        const { userId, longUrl } = req.body
        const result = await createShortUrl(userId, longUrl)
        res.send(result)
    })

    router.get("/url-details/:shortUrl", async (req, res) => {
        const { shortUrl } = req.params
        const result = await getLongUrl(shortUrl)
        res.send(result)
    })

    return router
}