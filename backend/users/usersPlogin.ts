import type { FastifyInstance } from "fastify";
import fs from "fs/promises";
import type { User } from "./usersTypes";
import bcrypt from 'bcrypt'

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
        const {username, password, role} = request.body

        const data = await fs.readFile('./users/users.json', 'utf-8')

        const users = JSON.parse(data)

        const existingUser = users.users.find((user: User) => {
           return user.username === username 
        })

        if (existingUser) {
        return reply.status(400).send({message: "User already exists"});
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newUser = {
        id: users.users.length + 1,
        username,
        password: hashedPassword,
        role: role || 'user'

      }

      users.users.push(newUser)

      await fs.writeFile('./users/users.json', JSON.stringify(users, null, 2))

      reply.status(201).send({massage: 'user created', user: {id: newUser.id, username: newUser.username }})
    },
  );
}
