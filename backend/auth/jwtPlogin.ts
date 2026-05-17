import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify';

export default fp(async (app: FastifyInstance) => {
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'defaultsecret'
  });

  app.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }       
})
});