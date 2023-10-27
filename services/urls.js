const nanoid = import("nanoid")
const QueryUrls = require("../db/urls")
const QueryAnalytics = require("../db/analytics")
const AnalyticsServices = require("../services/analytics")
const jwt = require('jsonwebtoken')

module.exports = (config) => {

    const { getRowByShortUrl, getRowByLongUrl, addNewShortUrl, getUrlsByUsername } = QueryUrls(config)
    const { addRowToAnalytics } = AnalyticsServices(config)
    const { getRowsByShortUrl, getUrlsByUsernameAndCount } = QueryAnalytics(config)

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
                res.json({ short_url: shortId, long_url: longUrl, created_at: new Date() })
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
        let urlRow = await getRowByShortUrl(shortUrl)
        if (urlRow) {
            await addRowToAnalytics(shortUrl, ipaddress, userAgent)
            // res.json({ redirectTo: urlRow.long_url })
            res.redirect(urlRow.long_url)
        } else {
            res.json({
                error: "Url not found"
            })
        }
    }

    async function getShortUrlStats(req, res) {
        const { shortUrl } = req.params
        try {
            const entries = await getRowsByShortUrl(shortUrl)
            const longUrl = entries[0].long_url

            const userAgentsAndVisits = {}
            const ipAddressAndVisits = {}
            const activityTimeAndVisits = {}
            for (let eachRow of entries) {
                userAgentsAndVisits[eachRow.user_agent] ? userAgentsAndVisits[eachRow.user_agent]++ : userAgentsAndVisits[eachRow.user_agent] = 1
                ipAddressAndVisits[eachRow.ipaddress] ? ipAddressAndVisits[eachRow.ipaddress]++ : ipAddressAndVisits[eachRow.ipaddress] = 1

                const time = new Date(eachRow.created_at).getHours()
                const nextHour = time === 23 ? 0 : time + 1
                activityTimeAndVisits[`${time}:00 - ${nextHour}:00`] ? activityTimeAndVisits[`${time}:00 - ${nextHour}:00`]++ : activityTimeAndVisits[`${time}:00 - ${nextHour}:00`] = 1
            }

            res.json({ totalVisits: entries.length, shortUrl, longUrl, userAgentsAndVisits, ipAddressAndVisits, activityTimeAndVisits })
        } catch (error) {
            console.log({ error: error.message })
            res.status(400).json({ error: 'resourse not found' })
        }

    }

    async function urlsList(req, res) {
        const { authorization } = req.headers
        const { stats } = req.query
        const jwtToken = authorization.split(' ')[1]
        const payload = jwt.verify(jwtToken, config.JWT_SECRET)
        let result = null;
        let formatedResult = null;
        if (!stats) {
            result = await getUrlsByUsername(payload.username)
            formatedResult = result.map((url, index) => ({
                id: index + 1,
                shortUrl: url.short_url,
                longUrl: url.long_url,
                created: url.created_at
            }))
        } else {
            result = await getUrlsByUsernameAndCount(payload.username)
            formatedResult = result.map((url, index) => ({
                id: index + 1,
                shortUrl: url.short_url,
                longUrl: url.long_url,
                visited: url.count,
                created: url.created_at
            }))
        }

        res.json(formatedResult)
    }


    return { createShortUrl, generateShortId, getLongUrl, redirectTo, getShortUrlStats, urlsList }
}