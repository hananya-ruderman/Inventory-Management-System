import { FastifyInstance } from "fastify";
import type { User } from "../users/usersTypes";
import bcrypt from 'bcrypt'
import {prisma} from '../db/dbConn'

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: Pick<User, "username" | "password"> }>(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body;
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user){
       return reply.status(404).send({massage: "user for this username is not found"})
      }

      const correctPassword = await bcrypt.compare(password, user.passwordHash)
      if (!correctPassword){
        return reply.status(401).send({massage: "password isn`t correct"})

      }
      const token = fastify.jwt.sign({
        username,
        role: user.role
      },{
        expiresIn: '1d'
      })
      return reply.send({massage: 'token created seccessfully', username, token})
    },
  );
}
