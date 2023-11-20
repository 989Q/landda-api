import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "./configs/db-mongo";
import Logging from "./utils/bashlog";

import admin from "./routes/admin";
import auth from "./routes/user/auth";
import userModel from "./routes/user/user";
import userManage from "./routes/user/manage";
import estate from "./routes/estate";
import blog from "./routes/blog";

const router = express();

mongoose
  .connect(config.mongo.url!)
  .then(() => {
    Logging.info("Connected to mongoDB.");
    StartServer();
  })
  .catch((error) => {
    Logging.error("nable to cennect: ");
    Logging.error(error);
  });

// start server if mongo connect
const StartServer = () => {
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
  router.use("/api/user", userManage);
  router.use("/api/estate", estate);
  router.use("/api/blog", blog);

  router.get("/test/ping", (req: Request, res: Response) =>
    res.status(200).json({ hello: "world" })
  );

  router.use((err: Error, req: Request, res: Response) => {
    Logging.error(err);

    res.status(500).json({
      error: err.message || "Server error", 
    });
  });

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`Server is running on port ${config.server.port}`)
    );
};
