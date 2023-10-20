const nanoid = import("nanoid")
const QueryUrls = require("../db/urls")
const AnalyticsServices = require("../services/analytics")

module.exports = (config) => {

    const { getRowByShortUrl, getRowByLongUrl, addNewShortUrl } = QueryUrls(config)
    const { addRowToAnalytics } = AnalyticsServices(config)

    async function generateShortId() {
        let uniqueId = (await nanoid).nanoid(config.shortId.length)
        return uniqueId
    }

    async function createShortUrl(req, res) {
        const { userId, longUrl } = req.body
        let isLongUrlExists = await getRowByLongUrl(userId, longUrl)

        if (isLongUrlExists && isLongUrlExists.user_id === userId) {
            res.json(isLongUrlExists)
        } else {
            let shortId = await generateShortId()
            let existingId = await getRowByShortUrl(shortId)

            while (existingId != undefined || null || false) {
                shortId = await generateShortId()
                existingId = await getRowByShortUrl(shortId)
            }

            try {
                const result = await addNewShortUrl(userId, shortId, longUrl)
                res.json({ shortId, insertId: result.insertId })
            } catch (error) {
                res.json({ error: error.message })
            }
        }

    }

    async function getLongUrl(req, res) {
        const { shortUrl } = req.params
        let urlRow = await getRowByShortUrl(shortUrl)
        if (urlRow) {
            res.json(urlRow)
        } else {
            res.json({ error: "Url not found" })
        }
    }


    async function redirectTo(req, res) {
        const { shortUrl } = req.params
        const ipaddress = req.ip
        const userAgent = req.headers['user-agent']
        await addRowToAnalytics(shortUrl, ipaddress, userAgent)
        let urlRow = await getRowByShortUrl(shortUrl)
        if (urlRow) {
            // res.json({ redirectTo: urlRow.long_url })
            res.redirect(urlRow.long_url)
        } else {
            res.json({
                error: "Url not found",
                redirectTo: "https://www.google.com"
            })
        }
    }

    return { createShortUrl, generateShortId, getLongUrl, redirectTo }
}