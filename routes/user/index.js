const express = require("express")
const UserServices = require("../../services/users")

module.exports = (config) => {
    const { userDetials, listUsers, createUser, login, verifyToken, updatePassword } = UserServices(config)
    const router = express.Router()

    router
        .get("/", listUsers)
        .post("/", createUser)
        .get("/user-details", userDetials)
        .post('/login', login)
        .post('/verifyToken', verifyToken)
        .post('/updatePassword', updatePassword)

    return router
} 