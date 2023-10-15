const nanoid = import("nanoid")
const QueryUrls = require("../db/urls")

module.exports = (config) => {

    const { getRowByShortUrl, getRowByLongUrl, addNewShortUrl } = QueryUrls(config)

    async function generateShortId() {
        let uniqueId = (await nanoid).nanoid(config.shortId.length)
        return uniqueId
    }

    async function createShortUrl(userId, longUrl) {
        let isLongUrlExists = await getRowByLongUrl(longUrl)

        if (isLongUrlExists && isLongUrlExists.user_id === userId) {
            return isLongUrlExists
        } else {
            let shortId = await generateShortId()
            let existingId = await getRowByShortUrl(shortId)

            while (existingId != undefined || null || false) {
                shortId = await generateShortId()
                existingId = await getRowByShortUrl(shortId)
            }

            return addNewShortUrl(userId, shortId, longUrl)
        }

    }

    async function getLongUrl(shortUrl) {
        let urlRow = await getRowByShortUrl(shortUrl)
        if (urlRow) {
            return urlRow
        }
        return { error: "Url not found" }
    }


    return { createShortUrl, generateShortId, getLongUrl }
}