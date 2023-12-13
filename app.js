const express = require("express");
const config = require("./config");
const { connectionToMySQL } = require("./db/connection");
const routes = require("./routes");

// connection to db
const mysqlClient = connectionToMySQL(config);
config.mysql.client = mysqlClient;

// init express
const app = express();

// init middleware
app.use(express.json());

// if json body failed to parse this middleware will handle error
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 400, message: err.message }); // Bad request
  }
  next();
});

// Routes
app.use("/", routes(config));

app.get("/", (req, res) => {
  res.send("Hello world");
});

// start server
app.listen(config.port, () => {
  console.info(`started at localhost: ${config.port}`);
});
