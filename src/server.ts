import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express, { json } from "express";
import { resolvers } from "./infrastructure/api/graphql/resolvers";
import { typeDefs } from "./infrastructure/api/graphql/type-defs";

async function main() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();

  app.use(json());
  app.use(cors());

  app.get("/", (_request, response) => response.json({ alive: true }));

  app.use("/graphql", expressMiddleware(server));


  app.listen(4000, async () => {
    console.log(
      "Running a GraphQL API server at http://localhost:4000/graphql"
    );
  });
}

main().catch((error) => console.error(error));
