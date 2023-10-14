const mysql = require("mysql2")

exports.connectionToMySQL = (config) => {
    try {
        console.info("Connecting to MySQL database...")
        const connection = mysql.createConnection(config.mysql.options).promise()
        console.info("Connected to MySQL database.")
        return connection
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}