module.exports.bookingSchema = `
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
`;
