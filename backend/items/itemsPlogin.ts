import type { FastifyInstance } from "fastify";
import { prisma } from "../db/dbConn.js";
import type { Item } from "./itemsTypes.ts";
import { randomUUID } from "crypto";

export default async function itemsPlogin(fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.auth);

  fastify.get("/items", async (request, reply) => {
    const data = await prisma.item.findMany();
    reply.send(data);
  });

  fastify.post<{ Body: Omit<Item, "id"> }>(
    "/items",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: { type: "string" },
            quantity: { type: "number" },
            price: { type: "number" },
          },
        },
      },
    },
    async (request, reply) => {
      const { name, price, quantity } = request.body;
      const { id } = request.user;

      const newItem = await prisma.item.create({
        data: {
          name,
          price,
          stock: quantity || 1,
          sku: randomUUID(),
          createdBy: {
            connect: {
              id,
            },
          },
        },
      });

      reply.status(201).send({ massage: "posting succede", item: newItem });
    },
  );

  fastify.put<{ Params: { id: string }; Body: Item }>(
    "/items/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: { type: "string" },
            price: { type: "number" },
            quantity: { type: "number" },
          },
        },
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      const { name, price, quantity } = request.body;

      const item = await prisma.item.findUnique({
        where: { id },
      });

      if (!item) {
        reply.status(404).send({ massage: "item not found" });
      }

      const updatedItem = await prisma.item.update({
        where: { id },
        data: {
          name,
          price,
          stock: quantity || 1,
        },
      });

      reply.status(200).send({ massage: "update succede", updatedItem });
    },
  );

  fastify.patch<{
    Params: { id: string };
    Body: Partial<{
      name: string;
      price: number;
      quantity: number;
    }>;
  }>(
    "/items/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            price: { type: "number" },
            quantity: { type: "number" },
          },
          anyOf: [
            { required: ["name"] },
            { required: ["price"] },
            { required: ["quantity"] },
          ],
        },
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      const { name, price, quantity } = request.body;

      const data = {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(quantity !== undefined && { stock: quantity }),
      };

      try {
        const updatedItem = await prisma.item.update({
          where: { id },
          data,
        });

        return reply.status(200).send({
          message: "update succeeded",
          item: updatedItem,
        });
      } catch (error: any) {
        if (error.code === "P2025") {
          return reply.status(404).send({
            message: "item not found",
          });
        }

        throw error;
      }
    },
  );
  fastify.delete<{ Params: { id: string } }>(
    "/items/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        const deletedItem = await prisma.item.delete({
          where: { id },
        });

        return reply.status(200).send({
          message: "item deleted",
          item: deletedItem,
        });
      } catch (error: any) {
        if (error.code === "P2025") {
          return reply.status(404).send({
            message: "item not found",
          });
        }

        throw error;
      }
    },
  );
}
