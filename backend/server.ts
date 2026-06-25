import { env } from "./config/env.js";
import Fastify from "fastify";
import cors from "@fastify/cors";
import itemsPlogin from "./items/itemsPlogin.js";
import authRoutes from "./auth/loginPlogin.js";
import jwtPlogin from "./auth/jwtPlogin.js";
import usersPlogin from "./users/usersPlogin.js";
import { prisma } from "./db/dbConn.js";

const server = Fastify({ logger: false });

const port = Number(env.serverPort);
server.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

server.register(jwtPlogin);
server.register(authRoutes);
server.register(usersPlogin);
server.register(itemsPlogin);

async function startServer() {
  try {
    await server.listen({ port });
    console.log(`Server is running on port ${port}`);
    await prisma.$connect();
    console.log("Connected to postgreSql DB through prisma");
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
