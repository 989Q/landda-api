import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/test/ping', (req: Request, res: Response) =>
  res.status(200).json('pong')
);

export default router;
