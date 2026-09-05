import http from "http";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import { credentials } from "./config/credentials.js";

const main = async () => {
  const server = http.createServer(app);

  try {
    await prisma.$connect();
    console.log("Databse connected successfully");
    server.listen(credentials.port || 4000, () => {
      console.log(`Server is running on http://localhost:${credentials.port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log("Database connection failed");
    process.exit(1);
  }
};

main();
