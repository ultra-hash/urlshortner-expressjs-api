const express = require("express")
const AnalyticsService = require("../../services/analytics")
const { verifyJwtToken } = require("../../middleware/auth")

module.exports = (config) => {
    const router = express.Router()

    const { usersCount, urlsCount, hitsCount } = AnalyticsService(config)

    router
        .get("/count/users", verifyJwtToken, usersCount)
        .get("/count/urls", verifyJwtToken, urlsCount)
        .get("/count/hits", verifyJwtToken, hitsCount)

    return router
}