import type { FastifyInstance } from "fastify";
import { prisma } from "../db/dbConn.js";
import type { Item } from "./itemsTypes.ts";
import { randomUUID } from "crypto";
import { masseges } from "../messages.js";

export default async function itemsPlogin(fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.auth);

  fastify.get("/items", async (request, reply) => {
  const data = await prisma.item.findMany({
    orderBy: {
      id: "asc",
    },
  });

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
            stock: { type: "number" },
            price: { type: "number" },
          },
        },
      },
    },
    async (request, reply) => {
      const { name, price, stock } = request.body;
      const { id } = request.user;

      const newItem = await prisma.item.create({
        data: {
          name,
          price,
          stock: stock || 1,
          sku: randomUUID(),
          createdBy: {
            connect: {
              id,
            },
          },
        },
      });

      reply.status(201).send({ massage: masseges.ITEM_CREATED, item: newItem });
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
            stock: { type: "number" },
          },
        },
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      const { name, price, stock } = request.body;

      const item = await prisma.item.findUnique({
        where: { id },
      });

      if (!item) {
        reply.status(404).send({ massage: masseges.ITEM_NOT_FOUND });
      }

      const updatedItem = await prisma.item.update({
        where: { id },
        data: {
          name,
          price,
          stock: stock || 1,
        },
      });

      reply.status(200).send({ massage: masseges.UPDATE_SUCCESS, updatedItem });
    },
  );

  fastify.patch<{
    Params: { id: string };
    Body: Partial<{
      name: string;
      price: number;
      stock: number;
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
            stock: { type: "number" },
          },
          anyOf: [
            { required: ["name"] },
            { required: ["price"] },
            { required: ["stock"] },
          ],
        },
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      const { name, price, stock } = request.body;

      const data = {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
      };

      try {
        const updatedItem = await prisma.item.update({
          where: { id },
          data,
        });

        return reply.status(200).send({
          message: masseges.UPDATE_SUCCESS,
          item: updatedItem,
        });
      } catch (error: any) {
        if (error.code === masseges.RECORD_NOT_FOUND_CODE) {
          return reply.status(404).send({
            message: masseges.ITEM_NOT_FOUND,
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
          message: masseges.ITEM_DELETED,
          item: deletedItem,
        });
      } catch (error: any) {
        if (error.code === masseges.RECORD_NOT_FOUND_CODE) {
          return reply.status(404).send({
            message: masseges.ITEM_NOT_FOUND,
          });
        }

        throw error;
      }
    },
  );
}
