const path = require('path');
const express = require('express');
const graphqlHttp = require('express-graphql');
const cors = require('cors');
const bodyParser = require('body-parser');
const { buildSchema } = require('graphql');
const utilsFunctions = require('./shared/utils/functions');

const app = express();

const EVENTS = [];

// Lets us define an invironment variables inside .env file
require('dotenv').config();

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Fix CORS error
app.use(cors());

// Routes
app.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to graphQL server.' });
});

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
    type RootQuery {
      events: [Event!]!
    }
    type RootMutation {
      createEvent(eventInput: EventInput): Event
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
  `),
    rootValue: {
      events: () => {
        return EVENTS;
      },
      createEvent: args => {
        const { eventInput } = args;
        const event = {
          _id: Math.random().toString(),
          title: eventInput.title,
          description: eventInput.description,
          price: +eventInput.price,
          date: eventInput.date
        };
        EVENTS.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

// Unknown routes/end points
app.use((req, res, next) => {
  utilsFunctions.customError('End point not found.', 404);
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  console.log(message);
  res.status(statusCode).json({ message });
});

module.exports = app;
