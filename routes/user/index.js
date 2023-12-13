const express = require("express");
const UserServices = require("../../services/users");
const { verifyJwtToken } = require("../../middleware/auth");

module.exports = (config) => {
  const {
    userDetials,
    listUsers,
    createUser,
    login,
    updatePassword,
    updateUserDetails,
  } = UserServices(config);
  const router = express.Router();

  router
    .get("/list", verifyJwtToken, listUsers)
    .post("/create", createUser)
    .get("/details", verifyJwtToken, userDetials)
    .post("/login", login)
    .post("/updatePassword", verifyJwtToken, updatePassword)
    .put("/updateUserDetails", verifyJwtToken, updateUserDetails);

  return router;
};
