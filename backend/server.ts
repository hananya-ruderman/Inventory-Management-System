import { env } from "./config/env.js";
import Fastify from "fastify";
import cors from "@fastify/cors";
import itemsPlugin from "./items/itemsPlugin.js";
import authRoutes from "./auth/loginPlugin.js";
import jwtPlugin from "./auth/jwtPlugin.js";
import usersPlugin from "./users/usersPlugin.js";
import { logger } from "./utils/logging.js";
import { connectDatabase } from "./db/dbConn.js";

const server = Fastify({ logger: false });

const port = Number(env.serverPort);
server.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

server.register(jwtPlugin);
server.register(authRoutes);
server.register(usersPlugin);
server.register(itemsPlugin);

async function startServer() {
  try {
    await server.listen({ port });
    logger.info(`Server is running on port ${port}`);
    await connectDatabase();
  } catch (error) {
    logger.error("Error starting server:", error);
  }
}

startServer();
