const express = require("express")
const UrlServices = require("../../services/urls")
const AnalyticsServices = require("../../services/analytics")

module.exports = (config) => {
    const router = express.Router()

    const { createShortUrl, getLongUrl, getUrlToRedirect } = UrlServices(config)
    const { addRowToAnalytics } = AnalyticsServices(config)

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

    router.get('/:shortUrl', async (req, res) => {
        const { shortUrl } = req.params
        const ipaddress = req.ip
        const userAgent = req.headers['user-agent']
        await addRowToAnalytics(shortUrl, ipaddress, userAgent)
        const longUrl = await getUrlToRedirect(shortUrl)
        res.redirect(longUrl.redirectTo)
    })

    return router
}