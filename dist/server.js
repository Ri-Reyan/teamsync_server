import { Server } from "socket.io";
import http from "http";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import { credentials } from "./config/credentials.js";
import redisClient, { connectRedis } from "./lib/redis.js";
const main = async () => {
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // তোমার ফ্রন্টএন্ড URL
            methods: ["GET", "POST", "PATCH", "DELETE"],
        },
    });
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        // ১. স্প্রিন্ট রুমে জয়েন করা
        socket.on("join_sprint_room", (sprintId) => {
            socket.join(`sprint_${sprintId}`);
            console.log(`Socket ${socket.id} joined sprint_${sprintId}`);
        });
        // ২. স্প্রিন্ট রুম থেকে লিভ নেওয়া
        socket.on("leave_sprint_room", (sprintId) => {
            socket.leave(`sprint_${sprintId}`);
        });
        // ৩. টাস্ক স্ট্যাটাস বা পজিশন আপডেট ইভেন্ট রিসিভ ও ব্রডকাস্ট করা
        socket.on("task_moved", (data) => {
            // data = { sprintId, taskId, status, sourceIndex, destinationIndex }
            // প্রেরক ছাড়া বাকিদের রুমে আপডেট পাঠানো (broadcast.to)
            socket.to(`sprint_${data.sprintId}`).emit("task_moved", data);
        });
        socket.on("task_created", (data) => {
            socket.to(`sprint_${data.sprintId}`).emit("task_created", data);
        });
        socket.on("task_updated", (data) => {
            socket.to(`sprint_${data.sprintId}`).emit("task_updated", data);
        });
        socket.on("task_deleted", (data) => {
            socket.to(`sprint_${data.sprintId}`).emit("task_deleted", data);
        });
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
    app.set("io", io);
    try {
        await prisma.$connect();
        console.log("◇ [Supabase]: Connected successfully");
        await connectRedis();
        server.listen(credentials.port || 4000, () => {
            console.log(`◇ Application successfully booted on http://localhost:${credentials.port || 4000}`);
        });
    }
    catch (error) {
        await prisma.$disconnect();
        await redisClient.disconnect();
        console.log("Database connection failed");
        console.log("Redis connection failed");
        process.exit(1);
    }
};
main();
