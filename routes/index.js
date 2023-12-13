const express = require("express");

const userRouter = require("./user");
const urlRouter = require("./url");
const analyticsRouter = require("./analytics");

module.exports = (config) => {
  const router = express.Router();

  router.use("/user", userRouter(config));
  router.use("/url", urlRouter(config));
  router.use("/analytics", analyticsRouter(config));

  return router;
};
