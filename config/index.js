const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  mysql: {
    options: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    client: null,
  },
  shortId: {
    length: 8, // Default length
  },
  port: process.env.SERVER_PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRECT,
};
