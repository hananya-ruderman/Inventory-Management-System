import type { FastifyInstance } from "fastify";
import type { User } from "./usersTypes.js";
import bcrypt from "bcrypt";
import { prisma } from "../db/dbConn.js";
import { env } from "../config/env.js";
import { masseges } from "../messages.js";

export default async function usersPlogin(fastify: FastifyInstance) {
  fastify.post<{ Body: Omit<User, "id"> }>(
    "/users",
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
      
      const { username, password} = request.body;
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (user) {
        return reply.status(400).send({ message: masseges.USER_ALREADY_EXISTS });
      }

      const salt = await bcrypt.genSalt(env.saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          username,
          passwordHash: hashedPassword,
          role: "user",
        },
      });

      reply
        .status(201)
        .send({
          massage: masseges.USER_CREATED,
          user: { id: newUser.id, username: newUser.username },
        });
    },
  );
}
