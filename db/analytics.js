module.exports = (config) => {

    const mysqlCient = config.mysql.client

    async function getRowByIpAddress(ipaddress) {
        const [row] = await mysqlCient.query(`SELECT * FROM ipaddresses WHERE ipaddress = ?`, [ipaddress])
        return row[0]
    }

    async function setRowByIpaddress(ipaddress) {
        const [result] = await mysqlCient.query(`INSERT INTO ipaddresses (ipaddress) VALUES (?)`, [ipaddress])
        return result
    }

    async function getRowByUserAgent(userAgent) {
        const [row] = await mysqlCient.query(`SELECT * FROM user_agents  WHERE user_agent = ?`, [userAgent])
        return row[0]
    }

    async function setRowByUserAgent(userAgent) {
        const [result] = await mysqlCient.query(`INSERT INTO user_agents (user_agent) VALUES (?)`, [userAgent])
        return result
    }

    async function addAnalytics(urlId, ipaddressId, userAgentId) {
        const [result] = await mysqlCient.query(`INSERT INTO analytics (url_id, ipaddress_id, user_agent_id) VALUES (?, ?, ?)`, [urlId, ipaddressId, userAgentId])
        return result
    }

    async function getRowsByShortUrl(shortUrl) {
        const [rows] = await mysqlCient.query(`select t2.short_url, t2.long_url, t3.user_agent , t4.ipaddress, t1.created_at
        from (select * from analytics where url_id = (select id from urls where short_url = ?)) as t1 
        LEFT JOIN urls as t2 ON t1.url_id = t2.id 
        LEFT JOIN user_agents as t3 ON t1.user_agent_id = t3.id
        LEFT JOIN ipaddresses as t4 ON t1.ipaddress_id = t4.id`, [shortUrl])
        return rows
    }

    return { getRowByIpAddress, setRowByIpaddress, getRowByUserAgent, setRowByUserAgent, addAnalytics, getRowsByShortUrl }
}
