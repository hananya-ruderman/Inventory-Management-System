import fastify from 'fastify'

const server = fastify();

async function startServer() {
    try {
        await server.listen({port: 3000});
        console.log("Server is running on port 3000");
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer()