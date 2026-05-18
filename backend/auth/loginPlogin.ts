import { FastifyInstance } from "fastify";
import type { User } from "../users/usersTypes";
import fs from "fs/promises";
import bcrypt from 'bcrypt'

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
      const data = await fs.readFile("users/users.json", "utf-8");

      const users = JSON.parse(data);
      
      const user = users.users.find((user: User) => {
        return user.username === username;
      });
      if (!user){
        reply.status(404).send({massage: "user for this username is not found"})
      }

      const correctPassword = await bcrypt.compare(password, user.password)
      if (!correctPassword){
         reply.status(404).send({massage: "password isn`t correct"})

      }
      const token = fastify.jwt.sign({
        username,
        role: user.role
      },{
        expiresIn: '1d'
      })
      reply.send({massage: 'token created seccessfully', token})
    },
  );
}
