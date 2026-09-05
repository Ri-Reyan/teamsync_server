import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app";
import { prisma } from "./lib/prisma";
const main = async () => {
    const server = http.createServer(app);
    try {
        await prisma.$connect();
    }
    catch (error) { }
    server.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
};
main();
