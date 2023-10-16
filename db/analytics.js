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

    return { getRowByIpAddress, setRowByIpaddress, getRowByUserAgent, setRowByUserAgent, addAnalytics }
}
