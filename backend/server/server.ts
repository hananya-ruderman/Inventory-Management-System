import Fastify from "fastify";
import cors from "@fastify/cors";

import itemsPlogin from "../items/itemsPlogin.js";
import authRoutes from "../auth/loginPlogin.js";
import jwtPlogin from "../auth/jwtPlogin.js";
import usersPlogin from "../users/usersPlogin.js";
import webSocketPlogin from "../raeltime/websocketPlogin.js";


export function buildServer() {
  const server = Fastify({ logger: false });

  server.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });

  server.register(webSocketPlogin);
  server.register(jwtPlogin);
  server.register(authRoutes);
  server.register(usersPlogin);
  server.register(itemsPlogin);

  return server;
}