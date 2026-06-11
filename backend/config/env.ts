import dotenv from "dotenv";
dotenv.config();

export const env = {
  serverPort: process.env.SERVER_PORT,
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: +(process.env.SALT_ROUNDS?? 10),

};
