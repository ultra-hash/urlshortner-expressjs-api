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

    async function getUserByEmail(email) {
        const [rows] = await mysqlClient.query('SELECT * FROM users WHERE email_id = ?', [email])
        return rows[0]
    }

    async function getUserByPhoneNumber(phoneNumber) {
        const [rows] = await mysqlClient.query('SELECT * FROM users WHERE phone_number = ?', [phoneNumber])
        return rows[0]
    }

    async function getUserByUsername(username) {
        const [rows] = await mysqlClient.query('SELECT * FROM users WHERE username = ?', [username])
        return rows[0]
    }

    return { getAllUsers, getUserById, getUserByEmail, getUserByPhoneNumber, getUserByUsername }
} 