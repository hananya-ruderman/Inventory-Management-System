import fp from "fastify-plugin";
import { createWebsocketManager } from "../raeltime/webSocketManager.js";
import websocket from "@fastify/websocket";

export default fp(async (fastify) => {
  fastify.register(websocket);
  const websocketManager = createWebsocketManager();

  fastify.decorate("websocketManager", websocketManager);
});
