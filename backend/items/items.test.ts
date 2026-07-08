import { describe, it, expect, vi } from "vitest";
import itemsPlugin from "./itemsPlogin.js";
import { prisma } from "../db/dbConn.js";
import { masseges } from "../massegas.js";

const mockedData = {
  fastify: {
    addHook: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    auth: vi.fn(),
    websocketManager: {
      broadcast: vi.fn(),
    },
  },
  request: {
    body: {
      name: "Laptop",
      price: 5000,
      stock: 10,
    },
    user: {
      id: "user-1",
    },
  },
  reply: {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  },
  newItem: {
    id: "item-1",
    name: "Laptop",
    price: 5000,
    stock: 10,
  },
};


describe("items plugin", () => {
  it("should create an item successfully", async () => {
    await itemsPlugin(mockedData.fastify as any);

    expect(mockedData.fastify.post).toHaveBeenCalled();

    const handler = mockedData.fastify.post.mock.calls[0]![2];

    vi.spyOn(prisma.item, "create").mockResolvedValue(
      mockedData.newItem as any,
    );

    await handler(mockedData.request, mockedData.reply);

    expect(prisma.item.create).toHaveBeenCalled();

    expect(mockedData.fastify.websocketManager.broadcast).toHaveBeenCalledWith({
      type: "inventoryChanged",
      action: "create",
      item: mockedData.newItem,
    });

    expect(mockedData.reply.send).toHaveBeenCalledWith({
      massage: masseges.ITEM_CREATED,
      item: mockedData.newItem,
    });
  });
});
