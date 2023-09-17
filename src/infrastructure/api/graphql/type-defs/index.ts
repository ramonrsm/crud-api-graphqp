import { gql } from "apollo-server-express";

export const typeDefs = [
  gql`
    type User {
      idUser: ID
      fullName: String!
      email: String!
    }

    input SaveUserInput {
      fullName: String!
      email: String!
    }

    input UpdateUserInput {
      idUser: ID!
      fullName: String
      email: String
    }

    type Query {
      users(idUser: ID): [User]
      hello: String
    }

    type Mutation {
      saveUser(data: SaveUserInput!): [User!]!
      updateUser(user: UpdateUserInput!): [User]
      deleteUser(idUser: ID!): Boolean
    }
  `,
];
