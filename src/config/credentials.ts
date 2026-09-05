import dotenv from "dotenv";
dotenv.config();

export const credentials = {
  database_url: process.env.DATABASE_URL,
  client_url: process.env.CLIENT_URL,
  port: process.env.PORT,
};
