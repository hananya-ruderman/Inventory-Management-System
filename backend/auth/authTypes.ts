import type { FastifyRequest, FastifyReply } from "fastify";
import "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    auth: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: number;
      username: string;
      role: string;
    };
    user: {
      id: number;
    };
  }
}
