import express from 'express';
import * as localStorage from '../controllers/admin/localStorage';
import * as createrController from '../controllers/admin/creater';
import { validateToken } from '../middlewares/accessToken';

const router = express.Router();

router
  // localStorage
  .get('/limit-blogs', localStorage.limitBlog)
  .get('/limit-estates', localStorage.limitEstate)
  .get('/limit-agents', localStorage.limitAgent)
  // blog
  .post('/create-blog', validateToken, createrController.createBlog);

export default router;
