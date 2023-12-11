const nanoid = import("nanoid")
const QueryUrls = require("../db/urls")
const QueryAnalytics = require("../db/analytics")
const AnalyticsServices = require("../services/analytics")
const url = require('node:url')

module.exports = (config) => {

    const { getRowByShortUrl, getRowByLongUrl, addNewShortUrl, getUrlsByUsername } = QueryUrls(config)
    const { addRowToAnalytics } = AnalyticsServices(config)
    const { getRowsByShortUrl, getUrlsByUsernameAndCount } = QueryAnalytics(config)

    async function generateShortId() {
        let uniqueId = (await nanoid).nanoid(config.shortId.length)
        return uniqueId
    }

    async function createShortUrl(req, res) {
        const userId = req.payload.id
        const { longUrl } = req.body

        let newUrl = url.parse(longUrl)

        if (newUrl.protocol === null || !["http:", "https:"].includes(newUrl.protocol.toLowerCase()))
            return res.status(400).json({ error: "protocal has to be http:// or https://" })

        try {

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

                await addNewShortUrl(userId, shortId, longUrl)
                res.json({ short_url: shortId, long_url: longUrl, created_at: new Date() })
            }

        } catch (error) {
            console.log(`Error: ${error.message}`)
            return res.status(500).json({ error: "Internal server error" })
        }
    }

    async function getLongUrl(req, res) {
        const { shortUrl } = req.params
        try {
            let urlRow = await getRowByShortUrl(shortUrl)
            if (urlRow) {
                res.json(urlRow)
            } else {
                res.json({ error: "Url not found" })
            }
        } catch (error) {
            console.log(`Error: ${error.message}`)
            return res.status(500).json({ error: "Internal server error" })
        }
    }


    async function redirectTo(req, res) {
        const { shortUrl } = req.params
        const ipaddress = req.ip
        const userAgent = req.headers['user-agent']
        try {

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
        } catch (error) {
            console.log(`Error: ${error.message}`)
            return res.status(500).json({ error: "Internal server error" })
        }
    }

    async function getShortUrlStats(req, res) {
        const { shortUrl } = req.params
        try {
            const entries = await getRowsByShortUrl(shortUrl)

            if (!entries.length) {
                console.log(entries)
                return res.status(400).json({ error: 'resourse not found' })
            }

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
            console.log(`Error: ${error.message}`)
            return res.status(500).json({ error: "Internal server error" })
        }

    }

    async function urlsList(req, res) {
        const { stats } = req.query
        const payload = req.payload
        let result = null;
        let formatedResult = null;
        if (!stats) {
            try {
                result = await getUrlsByUsername(payload.username)
                formatedResult = result.map((url, index) => ({
                    id: index + 1,
                    shortUrl: url.short_url,
                    longUrl: url.long_url,
                    created: url.created_at
                }))
            } catch (error) {
                console.log(`Error: ${error.message}`)
                return res.status(500).json({ error: "Internal server error" })
            }
        } else {
            try {
                result = await getUrlsByUsernameAndCount(payload.username)
                formatedResult = result.map((url, index) => ({
                    id: index + 1,
                    shortUrl: url.short_url,
                    longUrl: url.long_url,
                    visited: url.count,
                    created: url.created_at
                }))
            } catch (error) {
                console.log(`Error: ${error.message}`)
                return res.status(500).json({ error: "Internal server error" })
            }
        }

        res.json(formatedResult)
    }


    return { createShortUrl, generateShortId, getLongUrl, redirectTo, getShortUrlStats, urlsList }
}