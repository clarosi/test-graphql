module.exports.userSchema = `
type User {
  _id: ID!
  email: String!
  password: String
  createdEvents: [Event!]
}
input UserInput {
  email: String!
  password: String
}

type AuthData {
  userId: String!
  token: String!
  tokenExp: Int!
}
`;
