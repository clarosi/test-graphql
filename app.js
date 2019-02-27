const path = require("path");
const express = require("express");
const graphqlHttp = require("express-graphql");
const cors = require("cors");
const bodyParser = require("body-parser");

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolver = require("./graphql/resolver/index");
const error = require("./shared/utils/error");
const isAuth = require("./middleware/auth");

const app = express();

// Lets us define an invironment variables inside .env file
require("dotenv").config();

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Fix CORS error
app.use(cors());

app.use(isAuth);

// Routes
app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to graphQL server." });
});

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: process.env.ENVINRONMENT === "PRO" ? false : true
  })
);

// Unknown routes/end points
app.use((req, res, next) => {
  error.customError("End point not found.", 404);
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  console.log(message);
  res.status(statusCode).json({ message });
});

module.exports = app;
