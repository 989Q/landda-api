import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URI_DEV;
const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 5000;

export const serverConfig = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
};
