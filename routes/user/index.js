const express = require("express")
const UserServices = require("../../services/users")
const { verifyJwtToken } = require("../../middleware/auth")

module.exports = (config) => {
    const { userDetials, listUsers, createUser, login, verifyToken, updatePassword, updateUserDetails } = UserServices(config)
    const router = express.Router()

    router
        .get("/list", listUsers)
        .post("/create", createUser)
        .get("/details", userDetials)
        .post('/login', login)
        .post('/updatePassword', verifyJwtToken, updatePassword)
        .put('/updateUserDetails', verifyJwtToken, updateUserDetails)

    return router
} 