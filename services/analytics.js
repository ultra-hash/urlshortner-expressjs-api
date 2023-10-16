const AnalyticsQuery = require('../db/analytics')
const UrlsQuery = require('../db/urls')

module.exports = (config) => {

    const { getRowByIpAddress, setRowByIpaddress, getRowByUserAgent, setRowByUserAgent, addAnalytics } = AnalyticsQuery(config)
    const { getRowByShortUrl } = UrlsQuery(config)

    async function addRowToAnalytics(shortUrl, ipaddress, userAgent) {
        const ipaddressRow = await getRowByIpAddress(ipaddress)
        const userAgentRow = await getRowByUserAgent(userAgent)
        const urlRow = await getRowByShortUrl(shortUrl)

        let ipaddressId = null
        let userAgentId = null
        let urlId = urlRow.id

        if (ipaddressRow) {
            ipaddressId = ipaddressRow.id
        } else {
            const result = await setRowByIpaddress(ipaddress)
            ipaddressId = result.insertId
        }

        if (userAgentRow) {
            userAgentId = userAgentRow.id
        } else {
            const result = await setRowByUserAgent(userAgent)
            userAgentId = result.insertId
        }

        const result = await addAnalytics(urlId, ipaddressId, userAgentId)

        return result
    }


    return { addRowToAnalytics }
}