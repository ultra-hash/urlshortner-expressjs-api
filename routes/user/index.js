const express = require("express")
const UserServices = require("../../services/UserServices")

module.exports = (config) => {
    const { userDetials, listUsers } = UserServices(config)
    const router = express.Router()

    router.get("/", async (req, res) => {
        const result = await listUsers()
        res.json(result)
    })

    router.get("/user-details", async (req, res) => {
        const { id, email, phoneNumber, username } = req.query

        if (
            id && (email || username || phoneNumber) ||
            email && (id || username || phoneNumber) ||
            username && (id || email || phoneNumber) ||
            phoneNumber && (id || email || username) ||
            !id && !email && !phoneNumber && !username
        ) {
            res.status(400).json({ error: "Invalid Request" })
        } else {
            const result = await userDetials(id, email, phoneNumber, username)
            res.json(result)
        }
    })

    return router
} 