const express = require("express")
const UserServices = require("../../services/users")

module.exports = (config) => {
    const { userDetials, listUsers, createUser } = UserServices(config)
    const router = express.Router()

    router.get("/", async (req, res) => {
        const result = await listUsers()
        res.json(result)
    })

    router.post("/", async (req, res) => {
        const { first_name, last_name, username, email, password, phone_number } = req.body
        if (!first_name || !last_name || !username || !email || !password || !phone_number) {
            res.status(400).json({ error: "Invalid Request" })
        } else {
            const result = await createUser(first_name, last_name, username, email, password, phone_number)
            res.json(result)
        }
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