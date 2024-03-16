import express from 'express';
import * as localStorage from '../controllers/localstorage';
import * as createController from '../controllers/admin/create';
import { validateToken } from '../middlewares/accesstoken';

const router = express.Router();

router
  // localstorage
  .get('/limit-blogs', localStorage.limitBlog)
  .get('/limit-estates', localStorage.limitEstate)
  .get('/limit-agents', localStorage.limitAgent)
  // blog
  .post('/create-blog', validateToken, createController.createBlog);

export default router;
