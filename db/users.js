module.exports = (config) => {

    const mysqlClient = config.mysql.client

    async function getAllUsers() {
        const [rows] = await mysqlClient.query('SELECT * FROM users');
        return rows;
    }

    async function getUserById(id) {
        const [rows] = await mysqlClient.query('SELECT * FROM users WHERE id = ?', [id])
        return rows[0]
    }

    return { getAllUsers, getUserById }
} 