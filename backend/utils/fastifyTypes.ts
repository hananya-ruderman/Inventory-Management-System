import type { createWebsocketManager } from "../raeltime/websocketManager.js";

declare module "fastify" {
  interface FastifyInstance {
    auth: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
    websocketManager: ReturnType<typeof createWebsocketManager>;
  }
}
