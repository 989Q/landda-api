import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import cors from "cors";
import Logging from "./utils/Logging";

import authorRoutes from "./routes/Author";
import realEstates from "./routes/RealEstate";
import auth from "./routes/Auth"
import user from "./routes/user"

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
  router.use('/auth', auth);
  router.use('/user', user);
  // router.use('/authors', authorRoutes);
  router.use('/realEstate', realEstates);

  // Healthcheck
  router.get("/ping", (req, res, next) =>
    res.status(200).json({ hello: "world" })
  );

  // Error handling
  router.use((req, res, next) => {
    const error = new Error("Not found");

    Logging.error(error);

    res.status(404).json({
      message: error.message,
    });
  });

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`Server is running on port ${config.server.port}`)
    );
};
