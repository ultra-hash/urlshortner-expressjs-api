const express = require("express")
const AnalyticsService = require("../../services/analytics")

module.exports = (config) => {
    const router = express.Router()

    const { usersCount, urlsCount, hitsCount } = AnalyticsService(config)

    router
        .get("/count/users", usersCount)
        .get("/count/urls", urlsCount)
        .get("/count/hits", hitsCount)

    return router
}