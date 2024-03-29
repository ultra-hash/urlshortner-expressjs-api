const jwt = require("jsonwebtoken");
const config = require("../config");

async function verifyJwtToken(req, res, next) {
  const { authorization } = req.headers;
  try {
    const jwtToken = authorization.split(" ")[1];
    const payload = jwt.verify(jwtToken, config.JWT_SECRET);
    req.payload = payload;
    next();
  } catch (e) {
    res.json({ error: "invalid jwt_token" });
  }
}

module.exports = { verifyJwtToken };
