import { FastifyRequest, FastifyReply } from "fastify";

declare module 'fastify' {
    interface FastifyInstance {
        auth: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
    }
}