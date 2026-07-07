import fp from "fastify-plugin";
import { createWebsocketManager } from "./webSocketManager.js";
import websocket from "@fastify/websocket";
import { logger } from "../utils/logging.js";

export default fp(async (fastify) => {
  await fastify.register(websocket);
  const websocketManager = createWebsocketManager();

  fastify.decorate("websocketManager", websocketManager);

  fastify.get("/ws", { websocket: true }, (socket, req) => {
    logger.info("client connected");

    socket.on("message", (message) => {
      websocketManager.broadcast({
        text: message.toString(),
      });
    });

    websocketManager.addClient(socket);

    socket.on("close", () => {
      logger.info("client disconnected");

      websocketManager.removeClient(socket);
    });
  });
});
