import "@fastify/jwt";


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
