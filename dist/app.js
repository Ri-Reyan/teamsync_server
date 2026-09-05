import express from "express";
import cors from "cors";
import { credentials } from "./config/credentials";
import helmet from "helmet";
const app = express();
app.use(cors({
    origin: credentials.client_url,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Server is running",
    });
});
export default app;
