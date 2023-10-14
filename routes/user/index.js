const express = require("express")
const UserServices = require("../../services/UserServices")

module.exports = (config) => {
    const { userDetials, listUsers } = UserServices(config)
    const router = express.Router()

    router.get("/", async (req, res) => {
        const result = await listUsers()
        res.json(result)
    })

    router.get("/:id", async (req, res) => {
        const id = req.params.id
        const result = await userDetials(id)
        res.json(result)
    })

    return router
}