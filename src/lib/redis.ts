import { createClient } from "redis";

const redisClient = createClient({
  username: "default",
  password: "ppV6VvjwCP8AqM5P8Na4hQhhxicThtzw",
  socket: {
    host: "toad-innovative-forte-75572.db.redis.io",
    port: 15175,
  },
});
export default redisClient;
