import { describe, it, expect, vi } from "vitest";
import itemsPlugin from "./itemsPlogin.js";
import { prisma } from "../db/dbConn.js";
import { messages } from "../messages.js";
import { beforeEach } from "vitest";

beforeEach(() => {
  vi.clearAllMocks();
});

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

  requestDel: {
    params: {
      id: "123",
    },
    user: {
      id: "1",
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

    expect(prisma.item.create).toHaveBeenCalledWith({
      data: {
        name: "Laptop",
        price: 5000,
        stock: 10,
        sku: expect.any(String),
        createdBy: {
          connect: {
            id: "user-1",
          },
        },
      },
    });

    expect(mockedData.fastify.websocketManager.broadcast).toHaveBeenCalledWith({
      type: "inventoryChanged",
      action: "create",
      item: mockedData.newItem,
    });

    expect(mockedData.reply.status).toHaveBeenCalledWith(201);

    expect(mockedData.reply.send).toHaveBeenCalledWith({
      message: messages.ITEM_CREATED,
      item: mockedData.newItem,
    });
  });

  it("should delete item succefully", async () => {
    await itemsPlugin(mockedData.fastify as any);

    expect(mockedData.fastify.delete).toHaveBeenCalled();

    const handler = mockedData.fastify.delete.mock.calls[0]![2];

    vi.spyOn(prisma.item, "delete").mockResolvedValue(
      mockedData.newItem as any,
    );

    await handler(mockedData.requestDel, mockedData.reply);

    expect(prisma.item.delete).toHaveBeenCalled();

    expect(prisma.item.delete).toHaveBeenCalledWith({
      where: {
        id: 123,
      },
    });

    expect(mockedData.fastify.websocketManager.broadcast).toHaveBeenCalledWith({
      type: "inventoryChanged",
      action: "delete",
      item: mockedData.newItem,
    });

    expect(mockedData.reply.status).toHaveBeenCalledWith(200);

    expect(mockedData.reply.send).toHaveBeenCalledWith({
      message: messages.ITEM_DELETED,
      item: mockedData.newItem,
    });
  });

  it("should return 404 when item does not exist", async () => {
    await itemsPlugin(mockedData.fastify as any);

    const handler = mockedData.fastify.delete.mock.calls[0]![2];

    vi.spyOn(prisma.item, "delete").mockRejectedValue({
      code: messages.RECORD_NOT_FOUND_CODE,
    });

    await handler(mockedData.requestDel, mockedData.reply);

    expect(mockedData.reply.status).toHaveBeenCalledWith(404);

    expect(mockedData.reply.send).toHaveBeenCalledWith({
      message: messages.ITEM_NOT_FOUND,
    });

    expect(
      mockedData.fastify.websocketManager.broadcast,
    ).not.toHaveBeenCalled();
  });
});
