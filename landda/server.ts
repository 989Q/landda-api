import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./utils/bashlog";

import auth from "./routes/Auth";
import user from "./routes/User";
import stripe from "./routes/Stripe";
import estate from "./routes/estate";
import blog from "./routes/blog";
import message from "./routes/message";

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

// Only start the server if Mongo Connects
const StartServer = () => {
  // Log the request
  router.use((req, res, next) => {
    // Log the req
    Logging.info(
      `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      // Log the res
      Logging.info(
        `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(cors());
  router.use(express.json());

  // Routes
  router.use("/auth/user", auth);
  router.use("/api/user", user);
  router.use("/api/stripe", stripe);
  router.use("/api/message", message);
  router.use("/api/estate", estate);
  router.use("/api/blog", blog);

  // Healthcheck
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
