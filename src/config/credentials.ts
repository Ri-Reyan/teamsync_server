import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";
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
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_client_callback_url: process.env.GOOGLE_CALLBACK_URL,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  jwt_refresh_token_expires: process.env
    .JWT_REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"],
  jwt_access_token_expires: process.env
    .JWT_ACCESS_TOKEN_EXPIRES as SignOptions["expiresIn"],
};
