const AnalyticsQuery = require('../db/analytics')
const UrlsQuery = require('../db/urls')

module.exports = (config) => {

    const Analytics = AnalyticsQuery(config)
    const { getRowByShortUrl } = UrlsQuery(config)

    async function addRowToAnalytics(shortUrl, ipaddress, userAgent) {
        const ipaddressRow = await Analytics.getRowByIpAddress(ipaddress)
        const userAgentRow = await Analytics.getRowByUserAgent(userAgent)
        const urlRow = await getRowByShortUrl(shortUrl)

        let ipaddressId = null
        let userAgentId = null
        let urlId = urlRow.id

        if (ipaddressRow) {
            ipaddressId = ipaddressRow.id
        } else {
            const result = await Analytics.setRowByIpaddress(ipaddress)
            ipaddressId = result.insertId
        }

        if (userAgentRow) {
            userAgentId = userAgentRow.id
        } else {
            const result = await Analytics.setRowByUserAgent(userAgent)
            userAgentId = result.insertId
        }

        const result = await Analytics.addAnalytics(urlId, ipaddressId, userAgentId)

        return result
    }


    async function usersCount(req, res) {
        const { Last24Hours } = req.query

        let result = null
        if (Last24Hours === 'true') {
            rows = await Analytics.countNewUsersLast24Hours()
        } else {
            rows = await Analytics.countTotalUsers()
        }
        res.json({ status: "success", ...rows[0] })
    }

    async function urlsCount(req, res) {
        const { Last24Hours } = req.query

        let result = null
        if (Last24Hours === 'true') {
            rows = await Analytics.countNewUrlsLast24Hours()
        } else {
            rows = await Analytics.countTotalUrls()
        }
        res.json({ status: "success", ...rows[0] })
    }

    async function hitsCount(req, res) {
        const { Last24Hours } = req.query

        let result = null
        if (Last24Hours === 'true') {
            rows = await Analytics.countNewHitsLast24Hours()
        } else {
            rows = await Analytics.countTotalHits()
        }
        res.json({ status: "success", ...rows[0] })
    }

    return { addRowToAnalytics, usersCount, urlsCount, hitsCount }
}