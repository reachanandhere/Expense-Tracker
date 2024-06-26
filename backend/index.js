import http from "http";
import cors from "cors";
import express from "express";
import dotenv, { config } from "dotenv";
import path from "path";
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
import { job } from "./cron.js";  // Import the cron job
dotenv.config();

const MongoDBStore = connectMongo(session);
const __dirname = path.resolve();
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

job.start(); // Start the cron job

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: MergedTypeDefs,
  resolvers: mergedResolver,
  csrfPrevention: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});


await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();
console.log("Server is ready!");
