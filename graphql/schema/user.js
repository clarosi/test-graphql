module.exports.userSchema = `
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

type AuthData {
  userId: String!
  token: String!
  tokenExp: Int!
}
`;
