const express = require("express");

const userRouter = require("./user");
const urlRouter = require("./url");
const analyticsRouter = require("./analytics");

module.exports = (config) => {
  const router = express.Router();
  const { redirectTo } = require("../services/urls")(config);

  router.use("/user", userRouter(config));
  router.use("/url", urlRouter(config));
  router.use("/analytics", analyticsRouter(config));

  router.get("/:shortUrl", redirectTo);
  return router;
};
