import Fastify from 'fastify'
// import cors from '@fastify/cors';
import dotenv from 'dotenv';
// import jwtPlugin from './auth/jwtPlogin';
// import authRoutes from './auth/authRoutes';

dotenv.config();
const server = Fastify({logger: true});

const port = Number(process.env.SERVER_PORT || 3000)
// server.register(cors, {
//     origin: 'http://localhost:5173'
// });
server.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})


// server.register(jwtPlugin);
// server.register(authRoutes, { prefix: '/auth' });

async function startServer() {
    try {
        await server.listen({port});
        console.log("Server is running on port 3000");
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer()