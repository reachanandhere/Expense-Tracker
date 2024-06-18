import http from "http";
import cors from "cors";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { mergedResolver } from "./resolvers/index.js";
import { MergedTypeDefs } from "./typeDefs/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import dotenv from "dotenv"

dotenv.config()

const app = express();
const httpServer = http.createServer(app);




const server = new ApolloServer({
  typeDefs: MergedTypeDefs,
  resolvers: mergedResolver,
  csrfPrevention: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  })
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log('Server is ready!')