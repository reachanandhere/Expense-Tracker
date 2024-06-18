import http from "http";
import cors from "cors";
import express from "express";
import dotenv, { config } from "dotenv";

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { ApolloServer } from "@apollo/server";
import { mergedResolver } from "./resolvers/index.js";
import { MergedTypeDefs } from "./typeDefs/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildContext } from "graphql-passport";
import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";

dotenv.config();

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

store.on("error", (err) => {
  console.log(err);
});
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

configurePassport();


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
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();
console.log("Server is ready!");
