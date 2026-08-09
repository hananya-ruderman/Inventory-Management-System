import dotenv from "dotenv";
dotenv.config();

export const env = {
  serverPort: +(process.env.SERVER_PORT || 3000),
  host: process.env.HOST,
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: +(process.env.SALT_ROUNDS?? 10),
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL

};
