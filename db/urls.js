module.exports = (config) => {

    const mysqlClient = config.mysql.client

    async function getRowByShortUrl(shortUrl) {
        const [row] = await mysqlClient.query(
            `SELECT * FROM urls WHERE short_url =  ?`,
            [shortUrl]
        )
        return row[0]
    }

    async function getRowByLongUrl(longUrl) {
        const [row] = await mysqlClient.query(
            `SELECT * FROM urls WHERE long_url =  ?`,
            [longUrl]
        )
        return row[0]
    }

    async function addNewShortUrl(userId, shortUrl, longUrl) {
        const [row] = await mysqlClient.query(
            `INSERT INTO urls (user_id, long_url, short_url) VALUES (?, ?, ?)`,
            [userId, longUrl, shortUrl]
        )
        return row
    }

    return { getRowByShortUrl, getRowByLongUrl, addNewShortUrl }
}