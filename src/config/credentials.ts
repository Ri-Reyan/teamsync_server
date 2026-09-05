import dotenv from "dotenv";
dotenv.config();

export const credentials = {
  database_url: process.env.DATABASE_URL,
  client_url: process.env.CLIENT_URL,
  port: process.env.PORT,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
  redis_user: process.env.REDIS_USER,
  redis_password: process.env.REDIS_PASSWORD,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
};
