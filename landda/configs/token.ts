import dotenv from "dotenv";

dotenv.config();

export const tokenConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "6h8olza16w",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "qma1zas4pb",
  // 1 day - 86400000, 1 hour - 3600000, 1 min - 60000
  setTimeToken: 86400000,
};
