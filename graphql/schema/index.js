const { buildSchema } = require("graphql");

const { eventSchema } = require("./event");
const { bookingSchema } = require("./booking");
const { userSchema } = require("./user");

module.exports = buildSchema(`
    ${bookingSchema}
    ${eventSchema}
    ${userSchema}
    type RootQuery {
      events: [Event!]!
      bookings: [Booking!]!
      login(email: String!, password: String!): AuthData!
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
