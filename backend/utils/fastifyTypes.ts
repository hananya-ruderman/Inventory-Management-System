import type { createWebsocketManager } from "../raeltime/webSocketManager.js";

declare module "fastify" {
  interface FastifyInstance {
    auth: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
    websocketManager: ReturnType<typeof createWebsocketManager>;
  }
}
