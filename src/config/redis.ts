import { createClient } from "redis";

console.log("REDIS FILE LOADED");

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true
  }
});

export const connectRedis = async () => {

  console.log("CONNECTING REDIS");

  await redisClient.connect();

  console.log("REDIS CONNECTED");

};

export default redisClient;