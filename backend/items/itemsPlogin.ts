import { FastifyInstance } from "fastify";
import fs from "fs/promises";
import type { Item } from "./itemsTypes";

export default async function itemsPlogin(fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.auth);

  fastify.get("/items", async (request, reply) => {
    const data = await fs.readFile("./items/items.json", "utf-8");

    const parsedData = JSON.parse(data);
    reply.send(parsedData);
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

      const data = await fs.readFile("./items/items.json", "utf-8");

      const itemsObj = JSON.parse(data);

      const newItem = {
        id: itemsObj.items.length + 1,
        name,
        price,
        quantity: quantity ?? 1,
      };

      itemsObj.items.push(newItem);

      await fs.writeFile(
        "./items/items.json",
        JSON.stringify(itemsObj, null, 2),
      );

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

      const data = await fs.readFile("./items/items.json", "utf-8");

      const itemsObj = JSON.parse(data);

      const item = itemsObj.items.find((item: Item) => item.id === id);

      if (!item) {
        reply.status(404).send({ massage: "item not found" });
      }

      item.name = name; 
      item.price = price;
      item.quantity = quantity ?? 1;

      await fs.writeFile(
        "./items/items.json",
        JSON.stringify(itemsObj, null, 2),
      );
      reply.status(200).send({ massage: "update succede", item });
    },
  );

  fastify.patch<{ Params: { id: string }; Body: Item }>(
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
            {required: ["name"]},
            {required: ["price"]},
            {required: ["quantity"]}
          ]
        },
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      const { name, price, quantity } = request.body;

      const data = await fs.readFile("./items/items.json", "utf-8");

      const itemsObj = JSON.parse(data);

      const item = itemsObj.items.find((item: Item) => item.id === id);

      if (!item) {
        reply.status(404).send({ massage: "item not found" });
      }

      item.name = name ?? item.name;
      item.price = price ?? item.price;
      item.quantity = quantity ?? item.quantity;

      await fs.writeFile(
        "./items/items.json",
        JSON.stringify(itemsObj, null, 2),
      );
      reply.status(200).send({ massage: "update succede", item });
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
        console.log(id);
      const data = await fs.readFile("./items/items.json", "utf-8");

      const itemsObj = JSON.parse(data);
        console.log(itemsObj);
      const index = itemsObj.items.findIndex((item: Item) => item.id === id);

      if (index === -1) {
        reply.status(404).send({ massage: "item not found" });
      }

      const deletedItem = itemsObj.items.splice(index, 1)[0];

      await fs.writeFile(
        "./items/items.json",
        JSON.stringify(itemsObj, null, 2),
      );

      reply.status(204).send(deletedItem);
    },
  );
}
