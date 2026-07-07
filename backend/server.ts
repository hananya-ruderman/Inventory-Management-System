import { env } from "./config/env.js";
import Fastify from "fastify";
import cors from "@fastify/cors";
import itemsPlogin from "./items/itemsPlogin.js";
import authRoutes from "./auth/loginPlogin.js";
import jwtPlogin from "./auth/jwtPlogin.js";
import usersPlogin from "./users/usersPlogin.js";
import { logger } from "./utils/logging.js";
import { connectDatabase } from "./db/dbConn.js";
import webSocketPlogin from "./raeltime/websocketPlogin.js";

const server = Fastify({ logger: false });

const port = Number(env.serverPort);
server.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});


server.register(webSocketPlogin)
server.register(jwtPlogin);
server.register(authRoutes);
server.register(usersPlogin);
server.register(itemsPlogin);

async function startServer() {
  try {
    await server.listen({ port });
    logger.warn(`Server is running on port ${port}`);
    connectDatabase();
  } catch (error) {
    logger.error("Error starting server:", error);
  }
}

startServer();
