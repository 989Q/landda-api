import { createClient } from 'redis';

// const redisClient = createClient();
const redisClient = createClient({ url: 'redis://127.0.0.1:6379' })

redisClient.on('error', (err) => {
  console.log('Redis Error', err);
});

export function redisConnect() {
  return redisClient.connect();
}

export default redisClient;

// export const CACHE_EXPIRATION_TIME = 3600; // 1 hour (3600 seconds)
export const CACHE_EXPIRATION_TIME = 10; // 10 seconds
