import http from "http";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import { credentials } from "./config/credentials.js";
import redisClient, { connectRedis } from "./lib/redis.js";

const main = async () => {
  const server = http.createServer(app);

  try {
    await prisma.$connect();
    console.log("⚡ [Supabase]: Connected successfully");

    await connectRedis();

    server.listen(credentials.port || 4000, () => {
      console.log(
        `Server is running on http://localhost:${credentials.port || 4000}`,
      );
    });
  } catch (error) {
    await prisma.$disconnect();
    await redisClient.disconnect();
    console.log("Database connection failed");
    console.log("Redis connection failed");
    process.exit(1);
  }
};

main();
