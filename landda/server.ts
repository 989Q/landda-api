import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { redisConnect } from "./configs/redis";
import { serverConfig } from "./configs/server";
import Logging from "./utils/helpers/bashlog";

import admin from "./routes/admin";
import auth from "./routes/user/auth";
import userModel from "./routes/user/user";
import userManage from "./routes/user/manage";
import estate from "./routes/estate";
import blog from "./routes/blog";

const router = express();

async function startServer() {
  try {
    await redisConnect(); // connect to Redis

    // continue with MongoDB connection
    await mongoose.connect(serverConfig.mongo.url!);

    Logging.info("Connected to MongoDB and Redis.");

    initializeRoutes();
    initializeServer();
  } catch (error) {
    Logging.error("Failed to connect to MongoDB or Redis:");
    Logging.error(error);
  }
}

// initialize routes
function initializeRoutes() {
  router.use((req: Request, res: Response, next: NextFunction) => {
    // show log request
    Logging.info(
      `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      // show log response
      Logging.info(
        `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(cors());
  router.use(express.json());

  router.use("/admin", admin);
  router.use("/auth/user", auth);
  router.use("/api/user", userModel);
  router.use("/api/estate", estate);
  router.use("/api/blog", blog);
  // custom routes
  router.use("/api", userManage);

  router.get("/test/ping", (req: Request, res: Response) =>
    res.status(200).json({ hello: "world" })
  );

  router.use((err: Error, req: Request, res: Response) => {
    Logging.error(err);

    res.status(500).json({
      error: err.message || "Server error",
    });
  });
}

// initialize and start server
function initializeServer() {
  http.createServer(router).listen(serverConfig.server.port, () =>
    Logging.info(`Server is running on port ${serverConfig.server.port}`)
  );
}

startServer();
