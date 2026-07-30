import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(1),
  SALT_ROUNDS: z.coerce.number().default(10),
  DATABASE_URL: z.string().min(1),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  serverPort: parsedEnv.SERVER_PORT,
  jwtSecret: parsedEnv.JWT_SECRET,
  saltRounds: parsedEnv.SALT_ROUNDS,
  databaseUrl: parsedEnv.DATABASE_URL,
};