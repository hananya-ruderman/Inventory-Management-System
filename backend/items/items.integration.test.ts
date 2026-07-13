import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { buildServer } from "../server/server.js";
import { prisma } from "../db/dbConn.js";
import type { FastifyInstance } from "fastify";
import { messages } from "../messagas.js";

type JwtPayload = {
  id: number;
  username: string;
  role: string;
};

let server!: FastifyInstance;

describe("item integration", () => {
  beforeAll(async () => {
    server = buildServer();

    await server.ready();
  });

  afterAll(async () => {
    await server.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.item.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Should create item succefully", async () => {
    const registerResponse = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "testUser",
        password: "123456",
        role: "user",
      },
    });

    expect(registerResponse.statusCode).toBe(201);

    const loginResponse = await server.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "testUser",
        password: "123456",
      },
    });

    expect(loginResponse.statusCode).toBe(200);

    const { token } = loginResponse.json();

    expect(token).toBeDefined();

    const response = await server.inject({
      method: "POST",
      url: "/items",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: "Laptop",
        price: 5000,
        stock: 10,
      },
    });

    expect(response.statusCode).toBe(201);

    const body = response.json();

    expect(body.item.name).toBe("Laptop");

    const item = await prisma.item.findFirst({
      where: {
        name: "Laptop",
      },
    });

    expect(item).not.toBeNull();
  });

  it("should return 401 when creating item without token", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/items",
      payload: {
        name: "Laptop",
        price: 5000,
        stock: 10,
      },
    });

    expect(response.statusCode).toBe(401);

    expect(response.json()).toEqual({
      message: messages.UNAUTHENTICATED,
    });
  });

  it("should return a valid token after login", async () => {
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "moshe",
        password: "1234",
        role: "user",
      },
    });

    const response = await server.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "moshe",
        password: "1234",
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    const payload = server.jwt.verify<JwtPayload>(body.token);

    expect(payload.username).toBe("moshe");
    expect(payload.role).toBe("user");
  });
});
