import { createClient } from "redis";
import { credentials } from "../config/credentials.js";

const redisClient = createClient({
  username: credentials.redis_user,
  password: credentials.redis_password,
  socket: {
    host: credentials.redis_host,
    port: Number(credentials.redis_port),
  },
});
export default redisClient;
