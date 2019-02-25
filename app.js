const path = require("path");
const express = require("express");
const graphqlHttp = require("express-graphql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { buildSchema } = require("graphql");

const Event = require("./api/models/event");
const User = require("./api/models/user");
const utilsFunctions = require("./shared/utils/functions");

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

// Routes
app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to graphQL server." });
});

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
    type RootQuery {
      events: [Event!]!
    }
    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }

    type Event {
      _id: ID
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID
      name: String!
      email: String!
      password: String
    }
    input UserInput {
      name: String!
      email: String!
      password: String
    }
  `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(result => {
            console.log("success", result);
            return result;
          })
          .catch(err => {
            console.log(err.message);
            utilsFunctions.customError(err.message, 500);
          });
      },
      createEvent: args => {
        const event = Event({
          ...args.eventInput,
          creator: "5c73aacc47f9eb75b5100cc5"
        });
        let createdEvent;
        return event
          .save()
          .then(result => {
            createdEvent = result;
            return User.findById("5c73aacc47f9eb75b5100cc5");
            //console.log("success", result);
            //return result;
          })
          .then(result => {
            if (!result) {
              utilsFunctions.customError("User not found.", 500);
            }
            result.createdEvents.push(event._id);
            return result.save();
          })
          .then(result => {
            console.log(createdEvent);
            return createdEvent;
          })
          .catch(err => {
            console.log(err.message);
            utilsFunctions.customError(err.message, 500);
          });
      },
      createUser: args => {
        return bcrypt
          .hash(args.userInput.password, 12)
          .then(result => {
            const user = User({
              ...args.userInput,
              password: result
            });
            return user.save();
          })
          .then(result => {
            console.log(result);
            result.password = null;
            return result;
          })
          .catch(err => {
            console.log(err.message);
            utilsFunctions.customError(err.message, 500);
          });
      }
    },
    graphiql: true
  })
);

// Unknown routes/end points
app.use((req, res, next) => {
  utilsFunctions.customError("End point not found.", 404);
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  console.log(message);
  res.status(statusCode).json({ message });
});

module.exports = app;
