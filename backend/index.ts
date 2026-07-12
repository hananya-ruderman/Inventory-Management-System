import { env } from "./config/env.js";
import { logger } from "./utils/logging.js";
import { connectDatabase } from "./db/dbConn.js";
import { buildServer } from "./server/server.js";


const server = buildServer();

const port = env.serverPort;


async function startServer() {
  try {
    await server.listen({ port });

    logger.warn(`Server is running on port ${port}`);

    await connectDatabase();
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
}


startServer();