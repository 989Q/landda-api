import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { serverConfig } from './configs/server';
import Logging from './utils/logging';

import indexRouter from './routes/index';
import adminRouter from './routes/admin';
import authRouter from './routes/user/auth';
import userRouter from './routes/user/main';
import userManageRouter from './routes/user/manage';
import estateRouter from './routes/estate';
import blogRouter from './routes/blog';

const router = express();

mongoose
  .connect(serverConfig.mongo.url!)
  .then(() => {
    Logging.info('Connected to mongoDB.');
    StartServer();
  })
  .catch((error) => {
    Logging.error('ERROR_MONGODB: Unable to connect to MongoDB.');
    Logging.error(error);
  });

// start server if mongo connect
const StartServer = () => {
  router.use((req: Request, res: Response, next: NextFunction) => {
    // show log request
    Logging.info(
      `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
      // show log response
      Logging.info(
        `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(cors());
  router.use(express.json());

  router.use('/', indexRouter);
  router.use('/admin', adminRouter);
  router.use('/auth/user', authRouter);
  router.use('/api/user', userRouter);
  router.use('/api', userManageRouter);
  router.use('/api/estate', estateRouter);
  router.use('/api/blog', blogRouter);

  router.use((err: Error, req: Request, res: Response) => {
    Logging.error(err);

    res.status(500).json({
      error: err.message || 'Server error',
    });
  });

  http
    .createServer(router)
    .listen(serverConfig.server.port, () =>
      Logging.info(`Server is running on port ${serverConfig.server.port}`)
    );
};
