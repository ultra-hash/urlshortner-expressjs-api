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

    async function addNewUser(first_name, last_name, username, email, hashed_password, phone_number) {
        const [rows] = await mysqlClient.query(`
        INSERT INTO
        users (first_name, last_name, username, email_id, hashed_password, phone_number)
        VALUES (?, ?, ?, ?, ?, ?)`, [first_name, last_name, username, email, hashed_password, phone_number])
        return rows
    }

    async function updatePasswordByUsername(username, hashed_password) {
        const [rows] = await mysqlClient.query(`UPDATE users SET hashed_password = ? WHERE username = ?`, [hashed_password, username])
        return rows
    }

    return { getAllUsers, getUserById, getUserByEmail, getUserByPhoneNumber, getUserByUsername, addNewUser, updatePasswordByUsername }
} 