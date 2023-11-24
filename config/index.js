module.exports = {
    mysql: {
        options: {
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "swamy",
            database: "short_url_db"
        },
        client: null
    },
    shortId: {
        length: 8, // Default length
    },
    port: 2023,
    JWT_SECRET: "super secrect"
}