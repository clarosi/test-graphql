const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Booking {
      _id: ID!,
      event: Event!,
      user: User!,
      createdAt: String!
      updatedAt: String!
    }
    input BookingInput {
      eventId: ID!
    }

    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }
    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      name: String!
      email: String!
      password: String
      createdEvents: [Event!]
    }
    input UserInput {
      name: String!
      email: String!
      password: String
    }

    type RootQuery {
      events: [Event!]!
      bookings: [Booking!]!
    }
    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
      bookEvent(bookingInput: BookingInput): Booking!
      cancelBooking(bookingId: ID!): Booking!
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `);