import {FastifyRequest, FastifyReply} from 'fastify'

export async function authHook(request: FastifyRequest, reply: FastifyReply) {
    
        console.log(`${request.method} ${request.url}`);
    }
    