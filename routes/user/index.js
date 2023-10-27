const express = require("express")
const UserServices = require("../../services/users")

module.exports = (config) => {
    const { userDetials, listUsers, createUser, login, verifyToken, updatePassword, updateUserDetails } = UserServices(config)
    const router = express.Router()

    router
        .get("/list", listUsers)
        .post("/create", createUser)
        .get("/details", userDetials)
        .post('/login', login)
        .post('/verifyToken', verifyToken)
        .post('/updatePassword', updatePassword)
        .put('/updateUserDetails', updateUserDetails)

    return router
} 